"use client";

import type React from "react";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const presetColors = [
  "#000000",
  "#ffffff",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

export default function ColorPicker() {
  const [color, setColor] = useState("#2196f3");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure the value starts with #
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    // Validate hex color
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(value)) {
      setColor(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 rounded-md border"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-center gap-2">
          <Input
            value={color}
            onChange={handleColorChange}
            className="w-28 font-mono"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy hex"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Choose Color</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Tabs defaultValue="palette">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="palette" className="flex-1">
                Palette
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex-1">
                Custom
              </TabsTrigger>
            </TabsList>
            <TabsContent value="palette">
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className={cn(
                      "h-6 w-6 rounded-md border border-muted",
                      color === presetColor &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="custom">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-color">Hex Color</Label>
                  <Input
                    id="custom-color"
                    value={color}
                    onChange={handleColorChange}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>Preview</Label>
                  <div
                    className="h-10 w-full rounded-md border mt-1"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
