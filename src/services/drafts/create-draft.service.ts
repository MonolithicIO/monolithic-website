import { ForbiddenError } from "@errors/api.error";
import UserRoleModel from "@model/user-role.model";
import DraftsRepository from "@repository/drafts.repository";

export default class CreateDraftService {
  private readonly draftRepository: DraftsRepository;

  constructor(draftRepository: DraftsRepository = new DraftsRepository()) {
    this.draftRepository = draftRepository;
  }

  async createDraft(props: {
    userId: string;
    title: string;
    postId: string | null;
    roles: UserRoleModel[];
  }): Promise<string> {
    if (!props.roles.includes(UserRoleModel.Author)) {
      throw new ForbiddenError("Forbidden access to resource. User is not an author.");
    }

    const createdDraftId = await this.draftRepository.createDraft(props);

    return createdDraftId;
  }
}
