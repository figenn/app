import { useIsMobile } from "@/hooks/useIsMobile";
import { EventDetailsPopover } from "./eventDetailsPopover";
import { EventItemProps } from "@/interfaces/Calendar";

const EventItem = ({ event }: EventItemProps) => {
  const isMobile = useIsMobile();
  const displayName = isMobile
    ? `${event.name.substring(0, 3)}...`
    : event.name;

  return (
    <EventDetailsPopover event={event}>
      <div
        className="event-appear mb-1 flex h-8 w-full cursor-default items-center rounded px-1.5 text-xs font-medium transition-all hover:brightness-95 dark:hover:brightness-110"
        style={{
          backgroundColor: `${event.color}15`,
          color: event.color,
          borderLeft: `2px solid ${event.color}`,
        }}
      >
        <img
          src={event.logo_url || undefined}
          alt={event.name}
          className="h-6 w-6 rounded-full mr-1"
        />
        <span className="truncate">{displayName}</span>
      </div>
    </EventDetailsPopover>
  );
};

export default EventItem;
