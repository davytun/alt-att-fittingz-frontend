import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 2xl:grid-cols-4">
      {/* The fancy gradient + shadow is now applied with normal Tailwind (no weird * selector) */}
      <div className="contents [&>div[data-slot=card]]:bg-gradient-to-t [&>div[data-slot=card]]:from-primary/5 [&>div[data-slot=card]]:to-card [&>div[data-slot=card]]:shadow-xs dark:[&>div[data-slot=card]]:bg-card">
        {/* Card 1 – Total Revenue */}
        <Card data-slot="card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums lg:text-4xl">
              $1,250.00
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1 text-green-600">
                <IconTrendingUp className="size-3.5" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex items-center gap-2 font-medium">
              Trending up this month{" "}
              <IconTrendingUp className="size-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* Card 2 – New Customers */}
        <Card data-slot="card">
          <CardHeader>
            <CardDescription>New Customers</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums lg:text-4xl">
              1,234
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1 text-red-600">
                <IconTrendingDown className="size-3.5" />
                -20%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex items-center gap-2 font-medium">
              Down 20% this period{" "}
              <IconTrendingDown className="size-4 text-red-600" />
            </div>
            <div className="text-muted-foreground">
              Acquisition needs attention
            </div>
          </CardFooter>
        </Card>

        {/* Card 3 – Active Accounts */}
        <Card data-slot="card">
          <CardHeader>
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums lg:text-4xl">
              45,678
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1 text-green-600">
                <IconTrendingUp className="size-3.5" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex items-center gap-2 font-medium">
              Strong user retention{" "}
              <IconTrendingUp className="size-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">
              Engagement exceeds targets
            </div>
          </CardFooter>
        </Card>

        {/* Card 4 – Growth Rate */}
        <Card data-slot="card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums lg:text-4xl">
              4.5%
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1 text-green-600">
                <IconTrendingUp className="size-3.5" />
                +4.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex items-center gap-2 font-medium">
              Steady performance increase{" "}
              <IconTrendingUp className="size-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">
              Meets growth projections
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
