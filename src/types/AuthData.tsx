export type LoginInputData = {
  email: string;
  password: string;
};

export type UserCredentials = {
  userId: string;
  role: string;
};

export type AuthPayload = {
  userId: string;
  role: string;
  exp?: number;
};

// other auth types here
