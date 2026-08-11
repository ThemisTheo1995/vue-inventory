import type { Role, RoleDefinition } from './types'

export const roles: Record<Role, RoleDefinition> = {
  full_admin: {
    name: 'Full Admin',
    description: 'Full unconditional system capabilities. Read, write, update, and delete all records.',
    scopes: ['*:*'] 
  },
  edit_only: {
    name: 'Editor (No Deletes)',
    description: 'Can create and alter configuration data, but restricted from dropping data elements.',
    scopes: ['*.read', '*.create', '*.update']
  },
  read_only: {
    name: 'Viewer (Read Only)',
    description: 'Safe data visualization lookups. Explicitly restricted from making state changes.',
    scopes: ['*.read']
  }
}

export const roleColors: Record<Role, { activeCard: string; activeRadioBorder: string; activeRadioDot: string }> = {
  full_admin: {
    activeCard: 'border-purple-500 bg-purple-50/50 dark:bg-purple-500/10 ring-2 ring-purple-500/20',
    activeRadioBorder: 'border-purple-500',
    activeRadioDot: 'bg-purple-500'
  },
  edit_only: {
    activeCard: 'border-sky-500 bg-sky-50/50 dark:bg-sky-500/10 ring-2 ring-sky-500/20',
    activeRadioBorder: 'border-sky-500',
    activeRadioDot: 'bg-sky-500'
  },
  read_only: {
    activeCard: 'border-slate-500 bg-slate-50/50 dark:bg-slate-500/10 ring-2 ring-slate-500/20',
    activeRadioBorder: 'border-slate-500',
    activeRadioDot: 'bg-slate-500'
  }
}

export const getRoleStyles = (role: Role): string => {
  switch (role) {
    case 'full_admin':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
    case 'edit_only':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20'
    case 'read_only':
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
  }
}
