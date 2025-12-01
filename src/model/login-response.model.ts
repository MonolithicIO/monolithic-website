import UserModel from "./user.model";

type LoginResponseModel = {
  userModel: UserModel;
  sessionCookie: string;
};

export default LoginResponseModel;
