export interface LoginJWTData {
  externalId: string;
  email: string;
  roleName: string;
  roleSlug: string;
}

export interface LoginInfo {
  token: string;
  user: LoginJWTData;
}
