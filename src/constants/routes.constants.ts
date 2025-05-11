export const ROUTES = {
    API: {
        AUTH: '/auth',
        OTP: '/otp',
        ROLES: '/roles', 
        RESTRICTIONS: '/restrictions',
        USER: '/user',
        HEALTH: '/health',
        LANGUAGE: '/language',
        SKILLS: '/skills',
        SUBSCRIPTION: '/subscription'
    },
    AUTH: {
        SIGNUP: '/sign-up',
        SIGNIN: '/sign-in',
        RESET_PASSWORD: '/reset-password',
        DELETE_ACCOUNT: '/delete-account',
        REFRESH: '/refresh',
        PASSWORD_RECOVERY: '/password-recovery',
        LOGOUT: '/logout',
        IS_AUTHENTICATED: '/is-authenticated',
        OAUTH: '/oauth'
    },
    LANGUAGE: {
        CREATE: '/create',
        UPDATE: '/update',
        DELETE: '/delete'
    },
    OAUTH: {
        GOOGLE: '/google',
        GOOGLE_CALLBACK: '/google/callback'
    },
    OTP: {
        SEND_OTP: '/send-otp',
        VERIFY_OTP: '/verify-otp'
    },
    USER: {
        CURRENT_USER: '/current-user',
        UPDATE_WORKER_PROFILE: '/update-worker-profile',
        UPDATE_BUSINESS_PROFILE: '/update-business-profile',
        UPDATE_USER: '/update-user',
        TOGGLE_FIRST_TIME_LOGIN: '/toggle-first-time-login',
        DELETE_ACCOUNT: '/delete-account',
        FORGOT_PASSWORD: '/forgot-password',
        VERIFY_OTP: '/verify-otp',
        RESET_PASSWORD: '/reset-password'
    },
    ROLE: {
        UPDATE_ROLE: '/:id'
    },
    RESTRICTION: {
        ROOT: '/',
        USER_RESTRICTIONS: '/:user-id'
    },
    WROKER_SKILLS: {
        CREATE: '/',
        GET_ALL: '/',
        UPDATE: '/',
        DELETE: '/'
    }
} as const;