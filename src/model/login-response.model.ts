import UserModel from "./user.model";

type LoginResponseModel = {
  userModel: UserModel;
  sessionCookie: string;
  refreshToken: string;
};

export default LoginResponseModel;
