import { OAuth2Client } from "google-auth-library";
import ApiError from "../utils/ApiError.js";

// Validate env variables at startup
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    "Google OAuth environment variables are missing"
  );
}

// OAuth client
export const googleOAuthClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
);

/**
 * Verify Google ID token (used when frontend sends id_token)
 */
export const verifyGoogleIdToken = async (idToken) => {
  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      fullName: payload.name,
      avatar: payload.picture,
    };
  } catch (error) {
    throw new ApiError(401, "Invalid Google ID token");
  }
};
