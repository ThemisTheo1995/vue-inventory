// src/constants/plans.ts
import { Store, Zap, Sparkles, Headphones } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface PlanTier {
  id: string
  name: string
  tagline: string
  price: number | string
  icon: Component
  limits: {
    listings: string
    api: string
  }
  features: string[]
}

export const TIER_PLANS: PlanTier[] = [
  {
    id: 'growth',
    name: 'Growth Plan',
    tagline: 'Ideal for establishing side channels.',
    price: 49,
    icon: Store,
    limits: { listings: '2,500', api: '250,000' },
    features: [
      'Standard automated sync rates',
      'Email customer support response',
      'Basic system analytics dashboards'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Performance',
    tagline: 'Optimized for high-velocity merchants.',
    price: 99,
    icon: Zap,
    limits: { listings: '10,000', api: '1,500,000' },
    features: [
      'Priority real-time instant webhooks',
      'Dedicated 24/7 priority live support',
      'Advanced financial ledger reports',
      'Multi-currency processing matrices'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Sync',
    tagline: 'Built for high-volume operations.',
    price: 299,
    icon: Sparkles,
    limits: { listings: '50,000', api: '10,000,000' },
    features: [
      'Custom tailored ingestion API endpoints',
      'Personal account success engineer',
      'SLA performance uptime guarantee',
      'Custom white-label store reporting panels'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Scale',
    tagline: 'For high-volume global storefronts.',
    price: 'Custom',
    icon: Headphones,
    limits: { listings: '50,000+', api: '10,000,000+' },
    features: [
      'Dedicated backend infrastructure configuration',
      'Custom sync clock parameters (down to 1 min)',
      'Bespoke legal contracts & data NDAs',
      'Direct developer Slack channel sync'
    ]
  }
]
