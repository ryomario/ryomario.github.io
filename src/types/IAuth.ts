export interface IAuthContextValue {
  authenticated: boolean;
  authenticating: boolean;
  checkUserSession?: () => Promise<void>;
}

export interface IAuthSessionToken {
  name: string;
  exp: number;
}