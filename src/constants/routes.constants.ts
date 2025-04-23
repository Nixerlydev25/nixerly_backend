export const API_ROUTES = {
    AUTH: '/auth',
    OTP: '/otp',
    ROLES: '/roles',
    RESTRICTIONS: '/restrictions',
    USER: '/user',
    HEALTH: '/health',
    SUBSCRIPTION: '/subscription'
} as const;

export const AUTH_ROUTES = {
    SIGNUP: '/signup',
    SIGNIN: '/signin',
    RESET_PASSWORD: '/reset-password',
    DELETE_ACCOUNT: '/deleteMyAccount',
    REFRESH: '/refresh',
    PASSWORD_RECOVERY: '/passwordRecovery',
    LOGOUT: '/logout',
    IS_AUTHENTICATED: '/isauthenticated',
    OAUTH: '/oauth'
} as const;

export const OAUTH_ROUTES = {
    GOOGLE: '/google'
} as const;

export const OTP_ROUTES = {
    SEND_OTP: '/send-otp',
    VERIFY_OTP: '/verify-otp'
} as const;

export const USER_ROUTES = {
    CURRENT_USER: '/current-user',
    TOGGLE_FIRST_TIME_LOGIN: '/toggle-first-time-login',
    DELETE_ACCOUNT: '/delete-account',
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_OTP: '/verify-otp',
    RESET_PASSWORD: '/reset-password'
} as const;

export const ROLE_ROUTES = {
    UPDATE_ROLE: '/:id'
} as const;

export const RESTRICTION_ROUTES = {
    ROOT: '/',
} as const; 