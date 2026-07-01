const accessByRole = {
  Student: {
    readOnly: [
      { label: 'Email address', value: 'email' },
      { label: 'University role', value: 'role' },
      { label: 'Sign-in method', value: 'authProviders' },
      { label: 'Member since', value: 'createdAt' },
    ],
    writeAccess: [
      'Update profile picture',
      'Change password (email accounts)',
      'Create and edit own projects',
      'Submit projects for lecturer review',
      'Like and comment on projects',
    ],
  },
  Lecturer: {
    readOnly: [
      { label: 'Email address', value: 'email' },
      { label: 'University role', value: 'role' },
      { label: 'Sign-in method', value: 'authProviders' },
      { label: 'Member since', value: 'createdAt' },
    ],
    writeAccess: [
      'Update profile picture',
      'Change password (email accounts)',
      'Approve or reject student submissions',
      'Delete inappropriate projects',
      'Like and comment on projects',
    ],
  },
  Recruiter: {
    readOnly: [
      { label: 'Email address', value: 'email' },
      { label: 'University role', value: 'role' },
      { label: 'Sign-in method', value: 'authProviders' },
      { label: 'Member since', value: 'createdAt' },
    ],
    writeAccess: [
      'Update profile picture',
      'Change password (email accounts)',
      'Save projects to shortlist',
      'Follow students',
      'Like and comment on projects',
    ],
  },
  Admin: {
    readOnly: [
      { label: 'Email address', value: 'email' },
      { label: 'University role', value: 'role' },
      { label: 'Sign-in method', value: 'authProviders' },
      { label: 'Member since', value: 'createdAt' },
    ],
    writeAccess: [
      'Update profile picture',
      'Change password (email accounts)',
      'Approve or reject student submissions',
      'Delete inappropriate projects',
      'Like and comment on projects',
    ],
  },
};

export function getRoleAccess(role) {
  return accessByRole[role] || accessByRole.Student;
}

export function formatAuthProviders(providers = []) {
  if (!providers.length) return 'Email & password';
  return providers
    .map((p) => (p === 'google' ? 'Google' : 'Email & password'))
    .join(', ');
}

export function formatMemberSince(dateValue) {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
