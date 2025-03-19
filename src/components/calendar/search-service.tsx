"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

interface Service {
  name: string;
  logo_url: string;
}

interface SearchServiceProps {
  onSelect: (service: { name: string; photo: string }) => void;
}

async function fetchServices(search: string): Promise<Service[]> {
  if (!search) return [];
  const response = await fetch(
    `https://api.logo.dev/search?q=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOGO_API_KEY}`,
      },
    }
  );
  if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
  return response.json();
}

export default function SearchService({ onSelect }: SearchServiceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("subscription.form");

  const {
    data: results = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services", debouncedSearch],
    queryFn: () => fetchServices(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsResultsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsResultsOpen(debouncedSearch.length >= 3 && results.length > 0);
  }, [debouncedSearch, results]);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={t("service_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            onFocus={() => {
              if (debouncedSearch.length >= 3 && results.length > 0) {
                setIsResultsOpen(true);
              }
            }}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {isResultsOpen && (
          <div
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg"
          >
            {results.map(({ name, logo_url }) => (
              <div
                key={name + logo_url}
                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => {
                  onSelect({ name, photo: logo_url });
                  setSearchTerm("");
                  setIsResultsOpen(false);
                }}
              >
                {logo_url && (
                  <div className="h-8 w-8 rounded-md bg-white border flex items-center justify-center overflow-hidden">
                    <img
                      src={logo_url || "/placeholder.svg"}
                      alt={name}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                )}
                <span className="font-medium">{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">Error</p>}

      {debouncedSearch.length >= 3 &&
        !isLoading &&
        results.length === 0 &&
        !error && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("no_results")}
          </p>
        )}
    </div>
  );
}
