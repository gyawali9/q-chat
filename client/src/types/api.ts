// generally global api response and error response type
interface APIResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface AuthResponseUserData<T> {
  user: T;
  token: string;
}

interface ApiErrorDetail {
  field?: string;
  message: string;
}

interface ErrorResponse extends APIResponse<null> {
  errors?: ApiErrorDetail[];
}

export type { APIResponse, AuthResponseUserData, ErrorResponse };
