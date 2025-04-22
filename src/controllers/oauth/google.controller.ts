import { Request, Response } from "express";
import axios from "axios";

import { ResponseMessages, ResponseStatus } from "../../types/response.enums";
import { findOrCreateUser } from "../../model/v1/oauth/oauth.model";
import { setUserCookies } from "../../utils/auth.utils";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { OAuthProvider } from "@prisma/client";

class GoogleAuthController {
  private static clientId: string = process.env.GOOGLE_CLIENT_ID!;
  private static clientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;
  private static redirectUri: string = `${process.env.REDIRECT_URI}/google/callback`;

  public static async redirectToGoogleAuth(
    request: Request,
    response: Response
  ): Promise<void> {
    const authUrl = API_ENDPOINTS.GOOGLE.AUTH_URL(
      GoogleAuthController.clientId,
      GoogleAuthController.redirectUri
    );
    response.status(ResponseStatus.Redirect).redirect(authUrl);
  }

  public static async handleGoogleCallback(
    request: Request,
    response: Response
  ) {
    const authorizationCode = request.query.code as string;

    try {
      const tokenResponse = await axios.post(API_ENDPOINTS.GOOGLE.TOKEN_URL, {
        code: authorizationCode,
        client_id: GoogleAuthController.clientId,
        client_secret: GoogleAuthController.clientSecret,
        redirect_uri: GoogleAuthController.redirectUri,
        grant_type: "authorization_code",
      });

      const tokens = tokenResponse.data;

      const ticketResponse = await axios.get(
        API_ENDPOINTS.GOOGLE.TOKEN_INFO_URL(tokens.id_token)
      );

      const payload = ticketResponse.data;
      if (!payload) {
        throw new Error("Unable to retrieve user info from Google.");
      }

      const user = await findOrCreateUser(
        payload.email!,
        OAuthProvider.GOOGLE,
        payload.name!
      );

      const isMobileClient = request.headers["x-client"] === "mobile";

      const { accessToken, refreshToken } = setUserCookies(
        response,
        user,
        isMobileClient
      );

      if (isMobileClient) {
        return response.status(ResponseStatus.OK).json({
          userId: user.id,
          message: ResponseMessages.Success,
          accessToken,
          refreshToken,
          isVerified: user ? user.isVerified : false,
          role: user.role,
          isTemporaryPasswordReset: user.isTemporaryPasswordReset,
          firstTimeLogin: user.firstTimeLogin,
          restrictions: user.restrictions.map(
            (restriction) => restriction.restrictionType
          ),
          name: user.name,
        });
      }

      response
        .status(ResponseStatus.OK)
        .json({ message: ResponseMessages.Success });
    } catch (error) {
      console.error(error, "auth-google");
      response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }
}

export default GoogleAuthController;
