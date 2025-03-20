import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <Loader
      className={cn("animate-spin text-primary", className)}
      aria-hidden="true"
    />
  );
};

export default Spinner;
