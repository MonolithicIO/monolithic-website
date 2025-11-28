import { DatabaseProvider } from "@core/database/database.provider";
import CreateUserModel from "@model/create-user.model";
import UserModel from "@model/user.model";

export default class UserRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async getUserById(id: string): Promise<UserModel | null> {
    const rows = await this.databaseProvider.query<UserModel>("SELECT * FROM users WHERE id = $1", [id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async createUser(user: CreateUserModel): Promise<UserModel> {
    const rows = await this.databaseProvider.query<UserModel>(
      "INSERT INTO users (id, email, display_name, photo_url, phone_number, email_verified, provider, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        user.uid,
        user.email,
        user.display_name,
        user.photo_url,
        user.phone_number,
        user.email_verified,
        user.provider,
        user.created_at,
        user.updated_at,
      ]
    );
    return rows[0];
  }
}
