export const API_ENDPOINTS = {
  GOOGLE: {
    AUTH_URL: (clientId: string, redirectUri: string) =>
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email%20profile&access_type=offline`,
    TOKEN_URL: "https://oauth2.googleapis.com/token",
    TOKEN_INFO_URL: (idToken: string) =>
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
  },
};
