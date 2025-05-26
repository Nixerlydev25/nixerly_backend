//TODO: WORK IN PROGRESS FILE - CURRENTLY NOT USED.

// import { Roles, Restrictions } from "@prisma/client";

// interface AuthorizationRule {
//   requiredRoles?: Roles[];
//   restrictedTo?: Restrictions[];
//   public?: boolean;
// }

// const authorizationConfig: Record<string, Record<string, AuthorizationRule>> = {
//   // Auth routes
//   "/auth/signup": {
//     POST: {
//       public: true,
//     },
//   },
//   "/auth/signin": {
//     POST: {
//       public: true,
//     },
//   },
//   "/auth/reset-password": {
//     POST: {
//       public: true,
//     },
//   },
//   "/auth/refresh": {
//     PUT: {
//       public: true,
//     },
//   },
//   "/auth/passwordRecovery": {
//     PUT: {
//       public: true,
//     },
//   },
//   "/auth/logout": {
//     GET: {
//       public: true,
//     },
//   },
//   "/auth/isauthenticated": {
//     GET: {
//       public: true,
//     },
//   },

//   // OTP routes
//   "/otp/send-otp": {
//     POST: {
//       public: true,
//     },
//   },
//   "/otp/verify-otp": {
//     PUT: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER],
//     },
//   },

//   // Post routes
//   "/post/createPost": {
//     POST: {
//       requiredRoles: [Roles.ADMIN, Roles.DEVELOPER, Roles.USER],
//       restrictedTo: [Restrictions.CREATE_POST],
//     },
//   },
//   "/post/deletePost/:id": {
//     DELETE: {
//       requiredRoles: [Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.DELETE_POST],
//     },
//   },
//   "/post/refreshUrl": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.DEVELOPER],
//     },
//   },
//   "/post/getAllPosts": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.VIEW_POST],
//     },
//   },
//   "/post/updatePostLike": {
//     PUT: {
//       requiredRoles: [Roles.ADMIN, Roles.DEVELOPER],
//       restrictedTo: [Restrictions.EDIT_POST],
//     },
//   },
//   "/post/getAllPosts/:userId": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.VIEW_POST],
//     },
//   },
//   "/post/fetchFrequentUsedWords": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.ANALYST],
//       restrictedTo: [Restrictions.ANALYTICS],
//     },
//   },
//   "/post/reportPost": {
//     POST: {
//       requiredRoles: [Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.REPORT],
//     },
//   },
//   "/post/fetchReportedPost": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.MODERATOR],
//       restrictedTo: [Restrictions.REPORT],
//     },
//   },
//   "/post/fetch-single-post": {
//     GET: {
//       requiredRoles: [Roles.USER],
//       restrictedTo: [Restrictions.VIEW_POST],
//     },
//   },
//   "/post/search-post": {
//     GET: {
//       requiredRoles: [Roles.USER],
//       restrictedTo: [Restrictions.VIEW_POST],
//     },
//   },
//   "/post/like-post": {
//     POST: {
//       requiredRoles: [Roles.USER],
//       restrictedTo: [Restrictions.CREATE_POST],
//     },
//   },
//   "/post/engagement": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.ANALYST],
//     },
//   },
//   "/post/states": {
//     GET: {
//       requiredRoles: [Roles.ADMIN],
//       restrictedTo: [Restrictions.EDIT_POST],
//     },
//   },

//   // Comment routes
//   "/comments": {
//     GET: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.VIEW_COMMENT],
//     },
//     POST: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER],
//       restrictedTo: [Restrictions.CREATE_COMMENT],
//     },
//   },

//   // Role routes
//   "/roles/:id": {
//     PUT: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER],
//     },
//   },

//   // Admin routes
//   "/admin/create": {
//     POST: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.DEVELOPER],
//     },
//   },
//   "/admin/delete": {
//     DELETE: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.DEVELOPER],
//     },
//   },
//   "/admin/get-statistics": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.DEVELOPER],
//     },
//   },

//   // Notification routes
//   "/notification/getNotifications": {
//     GET: {
//       requiredRoles: [
//         Roles.SUPER_ADMIN,
//         Roles.ADMIN,
//         Roles.DEVELOPER,
//         Roles.USER,
//         Roles.GUEST,
//         Roles.ANALYST,
//         Roles.MODERATOR,
//       ],
//     },
//   },
//   "/notification/updateNotificationStatus": {
//     PUT: {
//       requiredRoles: [
//         Roles.SUPER_ADMIN,
//         Roles.ADMIN,
//         Roles.DEVELOPER,
//         Roles.USER,
//         Roles.GUEST,
//         Roles.ANALYST,
//         Roles.MODERATOR,
//       ],
//     },
//   },

//   // Miscellaneous routes
//   "/miscellaneous/create": {
//     POST: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
//     },
//   },
//   "/miscellaneous/:type": {
//     GET: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
//     },
//     PUT: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
//     },
//     DELETE: {
//       requiredRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
//     },
//   },

//   // FAQ routes
//   "/faq/create": {
//     POST: {
//       requiredRoles: [Roles.ADMIN],
//     },
//   },
//   "/faq/": {
//     GET: {
//       requiredRoles: [Roles.ADMIN],
//     },
//   },
//   "/faq/:id": {
//     GET: {
//       requiredRoles: [Roles.ADMIN],
//     },
//     PUT: {
//       requiredRoles: [Roles.ADMIN],
//     },
//     DELETE: {
//       requiredRoles: [Roles.ADMIN],
//     },
//   },

//   // Restriction routes
//   "/restrictions/": {
//     POST: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN],
//     },
//     GET: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN],
//     },
//     DELETE: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN],
//     },
//   },
//   "/restrictions/:userId": {
//     GET: {
//       requiredRoles: [Roles.SUPER_ADMIN, Roles.ADMIN],
//     },
//   },

//   // Health
//   "/health": {
//     GET: {
//       public: true,
//     },
//   },
// };

// export default authorizationConfig;
