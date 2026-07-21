/**
 * Deep Programmatic Schema Validation Layer
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class AuthValidator {
  public static validateEmail(email: string): string | null {
    if (!email) {
      return 'Email address is required.';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid business email address.';
    }
    return null;
  }

  public static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 12) {
      return 'Password must contain at least 12 characters.';
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecial)) {
      return 'Password must contain uppercase, lowercase, numeric, and special character components.';
    }
    return null;
  }

  public static validateUsername(username: string): string | null {
    if (!username) {
      return 'Username is required.';
    }
    if (username.length < 4) {
      return 'Username must be at least 4 characters.';
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return 'Username can only contain alphanumeric characters and underscores.';
    }
    return null;
  }

  public static validateConfirmPassword(password: string, confirm: string): string | null {
    if (!confirm) {
      return 'Please confirm your password.';
    }
    if (password !== confirm) {
      return 'Passwords must match.';
    }
    return null;
  }

  public static validateOtp(otp: string): string | null {
    if (!otp) {
      return 'One-Time Password (OTP) verification code is required.';
    }
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return 'Verification code must be exactly 6 numeric digits.';
    }
    return null;
  }
}
