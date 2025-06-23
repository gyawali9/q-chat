import jwt from "jsonwebtoken";

// function to generate token for a user
export const generateToken = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m", // short-lived access token
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d", // long-lived refresh token
  });

  return { accessToken, refreshToken };
};

// function to generate refresh token
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30d", // or 30d, up to you
  });
};

// function to genereate errror message based on error
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  // For other types (string, number, object), convert to string safely
  if (typeof error === "string") return error;
  if (typeof error === "number") return error.toString();
  try {
    return JSON.stringify(error) || "Unknown error";
  } catch {
    return "Unknown error";
  }
}
