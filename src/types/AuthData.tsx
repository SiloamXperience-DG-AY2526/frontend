export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  GENERAL_MANAGER = 'generalManager',
  FINANCE_MANAGER = 'financeManager',
  PARTNER = 'partner'
}

export type AuthUser = {
  userId: string,
  firstName: string,
  lastName: string,
  title?: string, 
  role: UserRole,
  email: string,
  hasOnboarded: boolean
}; 

export type AuthContextValue = {
  user: AuthUser | null,
  isLoading: boolean,
  authLogin: ( payload: AuthPayload ) => Promise<AuthUser>,
  authLogout: () => Promise<void>,
  authRefresh: () => Promise<void>
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
  role: UserRole;
  hasOnboarded: boolean;
  exp?: number;
};

export type UserCredentials = {
  userId: string;
  role: UserRole;
  hasOnboarded: boolean;
};

export type LoginInputData = {
  email: string;
  password: string;
};

// other auth types here
