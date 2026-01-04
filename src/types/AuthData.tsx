export type LoginInputData = {
  email: string;
  password: string;
};

export type UserCredentials = {
  userId: string;
  roles: string[];
};

export type AuthPayload = {
  userId: string;
  roles: { roleName: string }[];
  exp?: number;
};

// other auth types here
