import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Figenn",
  description: "Figenn is a finance tracking app",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Toaster richColors position="top-right" />
        <ThemeProvider>
          <NextIntlClientProvider>
            <NuqsAdapter>
              <QueryProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={true} />
              </QueryProvider>
            </NuqsAdapter>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
