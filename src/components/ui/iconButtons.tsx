"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
};

interface IconToggleGroupProps {
  toggleTheme?: boolean;
}

const IconDarkMode: React.FC<IconToggleGroupProps> = ({ toggleTheme }) => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {toggleTheme && (
        <IconButton
          ariaLabel="theme toggler"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="hidden h-[26px] w-[26px] fill-current dark:block" />
          <MoonIcon className="h-[26px] w-[26px] fill-current dark:hidden" />
        </IconButton>
      )}
    </>
  );
};

export { IconButton, IconDarkMode };
