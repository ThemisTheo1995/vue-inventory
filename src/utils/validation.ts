/**
 * Validates and formats names.
 * Matches backend:
 * 1. No numbers allowed.
 * 2. Min length 2, Max 50.
 * 3. Formats: "mary-jane" -> "Mary-Jane", "van der beek" -> "Van Der Beek"
 */
export const validateAndFormatName = (name: string, isLastName = false) => {
  const trimmedName = name.trim();

  // 1. Check for numbers
  if (/\d/.test(trimmedName)) {
    return { valid: false, error: "Names must not contain numbers", formatted: trimmedName };
  }

  // 2. Check length (First name needs 2+ chars, Last name optional)
  if (!isLastName && trimmedName.length < 2) {
    return { valid: false, error: "First name must be at least 2 characters long", formatted: trimmedName };
  }
  if (trimmedName.length > 50) {
    return { valid: false, error: "Name must not exceed 50 characters", formatted: trimmedName };
  }

  // 3. Apply formatting
  const formatted = trimmedName
    .toLowerCase()
    .replace(/(^|[\s-])\S/g, (char) => char.toUpperCase());

  return { valid: true, error: null, formatted };
};

/**
 * Sanitizes email: lowercase, no extra whitespace
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Validates email format.
 */
export const validateEmail = (email: string) => {
  const sanitized = sanitizeEmail(email);

  if (!sanitized) {
    return {
      valid: false,
      error: "Email address is required",
      formatted: sanitized,
    };
  }

  if (sanitized.length > 254) {
    return {
      valid: false,
      error: "Email address must not exceed 254 characters",
      formatted: sanitized,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return {
      valid: false,
      error: "Please enter a valid email address",
      formatted: sanitized,
    };
  }

  return {
    valid: true,
    error: null,
    formatted: sanitized,
  };
};

/**
 * Main validation function used by modals
 */
export const validateCustomerData = (data: {
  first_name: string;
  last_name: string | null | undefined;
  email: string;
}) => {
  const errors: string[] = [];

  // Normalize last_name to null if it's undefined or empty
  const rawLastName = data.last_name || null;

  // Validate First Name
  const fn = validateAndFormatName(data.first_name, false);
  if (!fn.valid) errors.push(fn.error!);

  // Validate Last Name (only if it has a value)
  if (rawLastName) {
    const ln = validateAndFormatName(rawLastName, true);
    if (!ln.valid) errors.push(ln.error!);
  }

  // Validate Email
  const email = validateEmail(data.email);
  if (!email.valid) errors.push(email.error!);

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      first_name: fn.formatted,
      // Explicitly ensure this is a string or null (never undefined)
      last_name: rawLastName ? validateAndFormatName(rawLastName, true).formatted : null,
      email: email.formatted,
    },
  };
};
