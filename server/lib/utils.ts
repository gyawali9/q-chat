import jwt from "jsonwebtoken";

// function to generate token for a user
export const generateToken = (userId: string) => {
  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET!
  );
  return token;
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
