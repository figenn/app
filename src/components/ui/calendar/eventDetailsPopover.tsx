import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventDetailsPopoverProps } from "@/interface/calendar";

export const EventDetailsPopover = ({
  event,
  children,
}: EventDetailsPopoverProps) => {
  const initials = getInitials(event.name);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden event-hover-card"
        align="center"
      >
        <div className="h-1.5" style={{ backgroundColor: event.color }} />
        <div className="p-4">
          <EventHeader event={event} initials={initials} />
          <EventDetails event={event} />
          {event.description && (
            <EventDescription description={event.description} />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

const EventHeader = ({
  event,
  initials,
}: {
  event: EventDetailsPopoverProps["event"];
  initials: string;
}) => (
  <div className="flex items-start gap-4">
    <Avatar className="h-12 w-12 border">
      <AvatarImage src={event.logo_url} alt={event.name} />
      <AvatarFallback style={{ backgroundColor: event.color, color: "white" }}>
        {initials}
      </AvatarFallback>
    </Avatar>
    <div className="space-y-1">
      <h4 className="text-sm font-semibold">{event.name}</h4>
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: event.color }}
        />
        <p className="text-xs text-muted-foreground capitalize">
          {event.category}
        </p>
      </div>
    </div>
  </div>
);

const EventDetails = ({
  event,
}: {
  event: EventDetailsPopoverProps["event"];
}) => (
  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
    <div>
      <p className="text-xs text-muted-foreground">Start date</p>
      <p className="font-medium">
        {format(new Date(event.start_date), "MMM dd, yyyy")}
      </p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Billing</p>
      <div className="flex items-center gap-1">
        <p className="font-medium capitalize">{event.billing_cycle}</p>
        <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">
          ${event.price}
        </span>
      </div>
    </div>
  </div>
);

const EventDescription = ({ description }: { description: string }) => (
  <div className="mt-4 border-t pt-3">
    <p className="text-xs text-muted-foreground">Description</p>
    <p className="mt-1 text-sm">{description}</p>
  </div>
);
