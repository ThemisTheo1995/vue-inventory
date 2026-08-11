/* Permission */
export type Role = 'full_admin' | 'edit_only' | 'read_only'

export type InvitationStatus = 'active' | 'pending'

export interface RoleDefinition {
  name: string
  description: string
  scopes: string[]
}

export interface TeamMember {
  id: string
  name: string | null
  email: string
  role: Role
  status: InvitationStatus
}

export interface InvitePayload {
  email: string
  role: Role
}


/* Contact */
export interface WorkspaceContact {
  id: string
  name: string
  email: string | null
  phone_number: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  postal_code: string | null
  country: string | null
}

export interface WorkspaceContactUpdate extends Partial<WorkspaceContact> {}


/* Pricing */
type MetricUsage = {
  used: number
  total: number
}

type PlanUsage = {
  metrics: {
    api_request?: MetricUsage
    listings_request?: MetricUsage
  }
}

export type UsageResponse = {
  workspace_id: string
  plans: Record<string, PlanUsage>
}
