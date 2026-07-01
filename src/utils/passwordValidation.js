const PASSWORD_RULES = [
  { id: 'length', label: '6–128 characters', test: (v) => v.length >= 6 && v.length <= 128 },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
];

export function getPasswordRuleStatus(password) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
}

export function isPasswordValid(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function validatePasswordForm({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!isPasswordValid(newPassword)) {
    errors.newPassword = 'Password does not meet the requirements';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password';
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return errors;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateProfileImage(file) {
  if (!file) return 'Please select an image file';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, GIF, or WebP images are allowed';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 5 MB';
  }
  return null;
}
