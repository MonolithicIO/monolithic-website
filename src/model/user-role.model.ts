enum UserRoleModel {
  Owner,
  Admin,
  Author,
}

export const mapStringToUserRole = (role: string): UserRoleModel | undefined => {
  switch (role) {
    case "Owner":
      return UserRoleModel.Owner;
    case "Admin":
      return UserRoleModel.Admin;
    case "Author":
      return UserRoleModel.Author;
    default:
      return undefined;
  }
};

export const mapNumberToUserRole = (role: number): UserRoleModel | undefined => {
  switch (role) {
    case 1:
      return UserRoleModel.Owner;
    case 2:
      return UserRoleModel.Admin;
    case 3:
      return UserRoleModel.Author;
    default:
      return undefined;
  }
};

export const getRoleCode = (role: UserRoleModel): number => {
  switch (role) {
    case UserRoleModel.Owner:
      return 1;
    case UserRoleModel.Admin:
      return 2;
    case UserRoleModel.Author:
      return 3;
    default:
      return 0;
  }
};

export default UserRoleModel;
