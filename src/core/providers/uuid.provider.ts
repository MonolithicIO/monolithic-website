import { v4 as uuid } from "uuid";

export default class UuidProvider {
  generate(): string {
    return uuid();
  }
}
