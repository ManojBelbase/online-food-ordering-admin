declare namespace Auth {
  interface User {
    _id?: string;
    id?: string;
    email: string;
    password?: string;
    role: string;
    name?: string;
    avatar?: string;
  }

  interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}