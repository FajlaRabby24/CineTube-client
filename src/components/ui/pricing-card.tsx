import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlareHover } from "./glare-hover";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <GlareHover className="rounded-xl" duration={600}>
      <Card className="w-[340px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{name}</CardTitle>
            {popular && <Badge>Popular</Badge>}
          </div>
          <CardDescription>{description}</CardDescription>
          <div className="flex items-baseline gap-1 pt-2">
            <span className="text-4xl font-semibold tracking-tight">${price}</span>
            <span className="text-muted-foreground text-sm">{period}</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M12.5 3.5L6 10L2.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {f}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Get started</Button>
        </CardFooter>
      </Card>
    </GlareHover>
  );
}
