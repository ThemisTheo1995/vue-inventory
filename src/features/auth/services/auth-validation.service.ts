// src/features/auth/services/auth-validation.service.ts

export interface UserStepData {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface WorkspaceStepData {
  name: string
  email: string
}

class AuthValidationService {
  /**
   * Evaluates RFC 5322 compliant structural email string matching syntax
   */
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  /**
   * Validates Step 1: Personal credentials configuration profiles
   */
  public validatePersonalDetails(user: UserStepData, confirmPassword: string): string | null {
    if (!user.first_name.trim() || !user.last_name.trim()) {
      return 'First and last names are mandatory fields.'
    }
    if (!user.email.trim()) {
      return 'An email address is required to create an account.'
    }
    if (!this.isValidEmail(user.email)) {
      return 'Please enter a valid, well-formed email address (e.g., name@domain.com).'
    }
    if (!user.password) {
      return 'A secure authentication password is required.'
    }
    if (user.password.length < 8) {
      return 'Security Requirement: Passwords must be at least 8 characters long.'
    }
    if (user.password !== confirmPassword) {
      return 'Security Verification Failed: The passwords entered do not match.'
    }
    return null
  }

  /**
   * Validates Step 2: Target workspace identity settings
   */
  public validateWorkspaceDetails(workspace: WorkspaceStepData): string | null {
    if (!workspace.name.trim()) {
      return 'Please specify a unique name for your primary organization workspace.'
    }
    if (!workspace.email.trim()) {
      return 'A functional workspace contact email address is required.'
    }
    if (!this.isValidEmail(workspace.email)) {
      return 'The workspace contact details must resolve to a valid email structure.'
    }
    return null
  }
}

export const authValidationService = new AuthValidationService()
