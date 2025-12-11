import UserModel from "@model/user.model";
import UserRepository from "@repository/user.repository";

export default class GetUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string): Promise<UserModel | null> {
    return this.userRepository.getUserById(id);
  }
}
