import UserModel from "@model/user.model";
import UserRepository from "@repository/user.repository";

export default class GetUserByEmailService {
  private readonly repository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.repository = userRepository;
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    return this.repository.getUserByEmail(email);
  }
}
