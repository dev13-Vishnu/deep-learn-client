
// ─── Auth ────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password must be ≥8 chars and contain at least:
 * one uppercase, one lowercase, one digit, one special char.
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!PASSWORD_REGEX.test(value))
    return 'Must include uppercase, lowercase, number, and special character (@$!%*?&#)';
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | null {
  if (!confirm) return 'Please confirm your password';
  if (confirm !== password) return 'Passwords do not match';
  return null;
}

export function validateName(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`;
  if (value.trim().length < 2) return `${label} must be at least 2 characters`;
  if (value.length > 100) return `${label} cannot exceed 100 characters`;
  return null;
}

// ─── Instructor Application ───────────────────────────────────────────────────

export const BIO_MIN = 50;
export const BIO_MAX = 1000;
export const COURSE_INTENT_MIN = 20;
export const COURSE_INTENT_MAX = 500;

export function validateBio(value: string): string | null {
  if (!value.trim()) return 'Bio is required';
  if (value.trim().length < BIO_MIN)
    return `Bio must be at least ${BIO_MIN} characters`;
  if (value.length > BIO_MAX)
    return `Bio cannot exceed ${BIO_MAX} characters`;
  return null;
}

export function validateCourseIntent(value: string): string | null {
  if (!value.trim()) return 'Course intent is required';
  if (value.trim().length < COURSE_INTENT_MIN)
    return `Please describe what you want to teach (at least ${COURSE_INTENT_MIN} characters)`;
  if (value.length > COURSE_INTENT_MAX)
    return `Course intent cannot exceed ${COURSE_INTENT_MAX} characters`;
  return null;
}

export function validateLanguage(value: string): string | null {
  if (!value.trim()) return 'Language of instruction is required';
  return null;
}

export function validateExperienceYears(value: string): string | null {
  if (!value) return 'Please select years of experience';
  return null;
}