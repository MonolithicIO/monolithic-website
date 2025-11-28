import CreateUserModel from "@model/create-user.model";
import UserModel from "@model/user.model";
import UserRepository from "@repository/user.repository";

export default class CreateUserSercice {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async createUser(user: CreateUserModel): Promise<UserModel> {
    return this.userRepository.createUser(user);
  }
}
