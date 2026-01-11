export type AuthUser = {
  userId: string,
  firstName: string,
  lastName: string,
  title?: string, 
  role: 'superAdmin' | 'generalManager' | 'financeManager' | 'partner',
  email: string
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
  role: 'superAdmin' | 'generalManager' | 'financeManager' | 'partner';
  exp?: number;
};

export type UserCredentials = {
  userId: string;
  role: 'superAdmin' | 'generalManager' | 'financeManager' | 'partner';
};

export type LoginInputData = {
  email: string;
  password: string;
};

// other auth types here
