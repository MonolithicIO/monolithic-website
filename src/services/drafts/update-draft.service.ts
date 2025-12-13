import { ForbiddenError, NotFoundError } from "@errors/api.error";
import UserRoleModel from "@model/user-role.model";
import DraftsRepository from "@repository/drafts.repository";

type UpdateDraftServiceProps = {
  title: string;
  authorId: string;
  draftId: string;
  content: string;
  authorRoles: UserRoleModel[];
};

export default class UpdateDraftService {
  private readonly draftsRepository: DraftsRepository;

  constructor(draftsRepository: DraftsRepository = new DraftsRepository()) {
    this.draftsRepository = draftsRepository;
  }

  async update(props: UpdateDraftServiceProps) {
    if (!props.authorRoles.includes(UserRoleModel.Author)) {
      throw new ForbiddenError("Forbidden access to resource. User is not an author.");
    }

    const draft = await this.draftsRepository.getDraftDetails(props.draftId);

    if (!draft) {
      throw new NotFoundError("Draft not found");
    }

    if (draft.authorId != props.authorId) {
      throw new ForbiddenError("Forbidden access to resource");
    }

    return await this.draftsRepository.updateDraft({
      draftId: props.draftId,
      title: props.title,
      markdownContent: props.content,
    });
  }
}
