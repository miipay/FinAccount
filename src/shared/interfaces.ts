export type JWTPayload = {
  sub: string;
  username: string;
  iss: 'MiiGuard';
  permissions?: IPermission[];
  refreshToken?: string;
};

export type JWTTokens = {
  accessToken: string;
  refreshToken: string;
};

export type IPermission = {
  service: string;
  permission: string;
};
