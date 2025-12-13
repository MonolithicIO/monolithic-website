import { ForbiddenError } from "@errors/api.error";
import Draft from "@model/draft.model";
import UserRoleModel from "@model/user-role.model";
import DraftsRepository from "@repository/drafts.repository";

type ListDraftsServiceProps = {
  authorId: string;
  authorRoles: UserRoleModel[];
  page: number;
  limit: number;
};

export default class ListDraftsServices {
  private readonly draftsRepository: DraftsRepository;

  constructor(draftsRepository: DraftsRepository = new DraftsRepository()) {
    this.draftsRepository = draftsRepository;
  }

  async execute(props: ListDraftsServiceProps): Promise<Draft[]> {
    if (!props.authorRoles.includes(UserRoleModel.Author)) {
      throw new ForbiddenError("Forbidden access to resource. User is not an author.");
    }

    return await this.draftsRepository.listDrafts({
      filters: {
        authorId: props.authorId,
      },
      page: props.page,
      pageSize: props.limit,
    });
  }
}
