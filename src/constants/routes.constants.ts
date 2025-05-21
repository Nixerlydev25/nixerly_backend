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
        SUBSCRIPTION: '/subscription',
        EXPERIENCE: '/experience',
        EDUCATION:'/education',
        WORKER: '/worker',
        BUSINESS: '/business',
        JOBS: '/jobs'
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
        DELETE: '/delete',
        UPDATE_ALL: '/update-all'
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
        UPDATE_USER: '/update-user',
        TOGGLE_FIRST_TIME_LOGIN: '/toggle-first-time-login',
        DELETE_ACCOUNT: '/delete-account',
        FORGOT_PASSWORD: '/forgot-password',
        VERIFY_OTP: '/verify-otp',
        RESET_PASSWORD: '/reset-password',
        GET_WORKER_PROFILE_DETAILS: '/worker-profile-details',
        GET_BUSINESS_PROFILE_DETAILS: '/business-profile-details',
    },
    ROLE: {
        UPDATE_ROLE: '/:id'
    },
    RESTRICTION: {
        ROOT: '/',
        USER_RESTRICTIONS: '/:user-id'
    },
    BUSINESS_PROFILE: {
        UPDATE_BUSINESS_PROFILE: '/update-business-profile',
        GET_ALL_BUSINESS_PROFILES: '/get-all-business-profiles',
        GET_BUSINESS_PROFILE_DETAILS: '/business-profile-details/:businessId',
    },
    WROKER_SKILLS: {
        CREATE: '/',
        GET_ALL: '/',
        UPDATE: '/',
        DELETE: '/'
    },
    WORKER_EXPERIENCE: {
        CREATE: '/',
        GET_ALL: '/',
        UPDATE: '/',
        DELETE: '/',
        UPDATE_ALL: '/update-all'
    },
    WORKER_EDUCATIONS: {
        CREATE: '/',
        GET_ALL: '/',
        UPDATE: '/',
        DELETE: '/',
        UPDATE_ALL: '/update-all'
    },
    WORKER_PROFILE: {
        GET_ALL: '/get-all-workers-profiles',
        GET_DETAILS: '/:workerId',
        UPDATE_WORKER_PROFILE: '/update-worker-profile',
        GET_PROFILE_PICTURE_UPLOAD_URL: '/profile-picture-upload-url',
        SAVE_PROFILE_PICTURE: '/save-profile-picture',
    },
    JOBS: {
        CREATE: '/create',
        GET_ALL: '/get-all-jobs',
        GET_DETAILS: '/:jobId',
        UPDATE: '/:jobId',
        DELETE: '/:jobId'
    }
} as const;