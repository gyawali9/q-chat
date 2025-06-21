interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  fullName: string;
  bio: string;
}

interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  profilePic?: string;
}

export type { LoginPayload, RegisterPayload, UpdateProfilePayload };
