export const actionColor: Record<string, 'success' | 'error' | 'info' | 'warning' | 'default'> = {
  LOGIN: 'success',
  LOGIN_FAILED: 'error',
  UPLOAD_CSV: 'info',
  GENERATE_REPORT: 'info',
  CREATE_USER: 'warning',
  UPDATE_USER: 'warning',
};

export const actionLabel: Record<string, string> = {
  LOGIN: 'Login',
  LOGIN_FAILED: 'Failed Login',
  UPLOAD_CSV: 'Upload CSV',
  GENERATE_REPORT: 'Generate Report',
  CREATE_USER: 'Create User',
  UPDATE_USER: 'Update User',
};