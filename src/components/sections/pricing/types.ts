export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  time_slot: string;
  price_monthly: string;
  price_yearly: string;
  cta: string;
  popular: boolean;
  accentColor: string;
}

export interface FeatureConfig {
  key: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}
