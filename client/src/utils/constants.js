export const HOST = import.meta.env.VITE_SERVER_URL;

export const ADMIN_AUTH_ROUTES = "api/adminAuth";
export const ADMIN_LOGIN_ROUTE = `${ADMIN_AUTH_ROUTES}/login`;
export const ADMIN_INFO_ROUTE = `${ADMIN_AUTH_ROUTES}/admin-info`;
export const ADMIN_LOGOUT_ROUTE = `${ADMIN_AUTH_ROUTES}/logout`;

export const DOCTOR_AUTH_ROUTES = "api/doctorAuth";
export const DOCTOR_LOGIN_ROUTE = `${DOCTOR_AUTH_ROUTES}/login`;
export const DOCTOR_INFO_ROUTE = `${DOCTOR_AUTH_ROUTES}/doctor-info`;
export const DOCTOR_LOGOUT_ROUTE = `${DOCTOR_AUTH_ROUTES}/logout`;

export const ADMIN_DASHBOARD_ROUTES = "api/adminDashboard";
export const REGISTER_DOCTOR_ROUTE = `${ADMIN_DASHBOARD_ROUTES}/register-doctor`;
export const DEREGISTER_DOCTOR_ROUTE = `${ADMIN_DASHBOARD_ROUTES}/deregister-doctor`;
export const VIEW_PATIENTS_ROUTE = `${ADMIN_DASHBOARD_ROUTES}/view-patients`;
export const DOCTORS_BY_SPECIALIZATION_ROUTE = `${ADMIN_DASHBOARD_ROUTES}/doctors-by-specialization`;
export const ALL_DOCTORS_ROUTE = `${ADMIN_DASHBOARD_ROUTES}/all-doctors`;

export const DOCTOR_DASHBOARD_ROUTES = "api/doctorDashboard";
export const GET_APPOINTMENTS_ROUTE = `${DOCTOR_DASHBOARD_ROUTES}/appointments`;
export const GET_PATIENT_HISTORY_ROUTE = (patientId) =>
  `${DOCTOR_DASHBOARD_ROUTES}/patient-history/${patientId}`;
export const GENERATE_PRESCRIPTION_ROUTE = `${DOCTOR_DASHBOARD_ROUTES}/generate-prescription`;
