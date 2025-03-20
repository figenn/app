import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMonthYear } from "@/utils/calendarUtils";
import { CalendarHeaderProps } from "@/interface/calendar";

const CalendarHeader = ({
  currentMonth,
  onNextMonth,
  onPrevMonth,
  locale,
}: CalendarHeaderProps) => (
  <div className="flex items-center justify-between p-4">
    <h2 className="text-xl font-medium tracking-tight text-balance">
      {formatMonthYear(currentMonth, locale)}
    </h2>
    <div className="flex space-x-2">
      <MonthButton
        icon={<ChevronLeft className="h-4 w-4" />}
        onClick={onPrevMonth}
        label="Previous month"
      />
      <MonthButton
        icon={<ChevronRight className="h-4 w-4" />}
        onClick={onNextMonth}
        label="Next month"
      />
    </div>
  </div>
);

const MonthButton = ({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    className="h-8 w-8 rounded-full transition-all hover:scale-105 active:scale-95"
  >
    {icon}
    <span className="sr-only">{label}</span>
  </Button>
);

export default CalendarHeader;
