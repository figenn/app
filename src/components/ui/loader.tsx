import { SpinnerOne } from "@mynaui/icons-react";
import { cn } from "@/lib/utils";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <SpinnerOne
      className={cn("animate-spin text-primary", className)}
      aria-hidden="true"
    />
  );
};

export default Spinner;
