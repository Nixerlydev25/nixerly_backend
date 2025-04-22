export type User = {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
};

export enum environment {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export enum PERMISSIONS {
  CREATE_POST = "create_post",
  EDIT_POST = "edit_post",
  DELETE_POST = "delete_post",
  VIEW_POST = "view_post",
  CREATE_COMMENT = "create_comment",
  VIEW_COMMENT = "view_comment",
  ANALYTICS = "analytics",
  REPORT = "report",
  ACCOUNT = "account",
  CONTENT = "content"
}

export interface JWTPayload {
  email: string;
  userId: string;
  role: string;
  isTemporaryPasswordReset?: boolean;
  permissions?: any;
  oAuthAccessToken: string;
}

export const mockUser = {
  id: 1,
  email: "admin@example.com",
  role: "SUPER_ADMIN",
};
