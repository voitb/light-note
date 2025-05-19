import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface PricingTier {
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  buttonText: string;
}

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col",
        tier.highlighted && "border-2 relative shadow-lg"
      )}
    >
      {tier.badge && (
        <Badge className="absolute -top-2 right-4 bg-black text-white">
          {tier.badge}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <span className="text-3xl font-bold">{tier.price}</span>
          {tier.price !== "Free" && (
            <span className="text-muted-foreground ml-1">
              /{tier.billingPeriod}
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={cn(
            "w-full",
            tier.highlighted ? "bg-black text-white" : ""
          )}
          variant={tier.highlighted ? "default" : "outline"}
        >
          {tier.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PricingCards() {
  const tiers: PricingTier[] = [
    {
      name: "Free",
      description: "Essential note-taking for personal use",
      price: "Free",
      billingPeriod: "",
      features: [
        "Up to 50 notes",
        "Basic Markdown support",
        "Local storage only",
        "Single device access",
        "Basic AI assistance",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      description: "Advanced features for power users",
      price: "$9.99",
      billingPeriod: "month",
      features: [
        "Unlimited notes",
        "Advanced Markdown with extras",
        "Cloud sync across devices",
        "Multiple device access",
        "Enhanced AI assistance",
        "Collaborate with 1 user",
        "Priority support",
      ],
      highlighted: true,
      badge: "Popular",
      buttonText: "Subscribe Now",
    },
    {
      name: "Business",
      description: "For teams and professional use",
      price: "$19.99",
      billingPeriod: "month",
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Collaboration with up to 10 users",
        "Advanced security",
        "Admin controls",
        "Premium AI features",
        "API access",
        "24/7 dedicated support",
      ],
      buttonText: "Contact Sales",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier, i) => (
        <PricingCard key={i} tier={tier} />
      ))}
    </div>
  );
}
