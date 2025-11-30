export namespace Auth {
  export interface User {
    _id?: string;
    id?: string;
    email: string;
    password?: string;
    role: string;
    name?: string;
    avatar?: string;
  }

  export interface AuthState {
    user: User | null;
    accessToken: string | null;
    loadingLogin: boolean;
    loadingSignup: boolean;
    errorLogin: string | null;
    errorSignup: string | null;
    isInitialized: boolean;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface LivenessResult {
  isLive: boolean;
  confidence: number;
  details: {
    sizeVariation: boolean;
    movementDetected: boolean;
    textureValid: boolean;
  };
}

export interface BlinkResult {
  blinkDetected: boolean;
  blinkCount: number;
}
