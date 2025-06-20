export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  profilePic?: string;
  // optional; add/remove fields based on your form
}
