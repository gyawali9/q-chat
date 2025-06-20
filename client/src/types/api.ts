interface ApiErrorDetail {
  field?: string;
  message: string;
}

interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  userData?: T;
  errors?: ApiErrorDetail[];
  stack?: string;
}

export type { ApiErrorDetail, ApiResponse };
