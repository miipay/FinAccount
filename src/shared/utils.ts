import { JWTPayload, IPermission } from './interfaces';

export const hasPermission = (user: JWTPayload, permission: IPermission): boolean => {
  if (!user.permissions) {
    return false;
  }
  return !!user.permissions.find(
    (userPerm) => userPerm.permission === permission.permission && userPerm.service === permission.service,
  );
};

export const hasPermissions = (user: JWTPayload, permissions: IPermission[]): boolean => {
  return permissions.every((perm) => hasPermission(user, perm));
};
