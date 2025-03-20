"use client";

import type React from "react";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { Subscription } from "@/interface/subscription";
import { useLocale, useTranslations } from "next-intl";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const getDateLocale = (locale: string) => (locale === "fr" ? fr : enUS);

const formatPrice = (locale: string, price: number) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: locale === "fr" ? "EUR" : "USD",
  }).format(price);

const formatMonthDay = (locale: string, dateString: string) =>
  format(new Date(dateString), "d MMMM", {
    locale: getDateLocale(locale),
  });

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
}) => {
  const locale = useLocale();
  const t = useTranslations("SubscriptionCard");

  const dateLocale = useMemo(() => getDateLocale(locale), [locale]);
  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(subscription.start_date), {
        addSuffix: true,
        locale: dateLocale,
      }),
    [subscription.start_date, dateLocale]
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center rounded-md p-1.5 cursor-pointer shadow-sm text-black transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
          style={{ backgroundColor: subscription.color }}
        >
          <Avatar className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110">
            <AvatarImage
              className="bg-white p-[1px] rounded-full"
              src={subscription.logo_url || ""}
              alt={subscription.name}
            />
          </Avatar>
          <span className="text-xs font-medium truncate">
            {subscription.name}
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden shadow-lg">
        <div
          className="h-1.5"
          style={{ backgroundColor: subscription.color }}
        ></div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  className="bg-white p-1 rounded-md"
                  src={subscription.logo_url || ""}
                  alt={subscription.name}
                />
              </Avatar>
              <div className="ml-3">
                <h3 className="text-lg font-semibold">{subscription.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                {formatPrice(locale, subscription.price)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("billingCycle", { cycle: subscription.billing_cycle })}
              </p>
            </div>
          </div>

          {subscription.description && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {subscription.description}
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SubscriptionCard;
