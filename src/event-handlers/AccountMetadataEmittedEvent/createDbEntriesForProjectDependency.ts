import type { Transaction } from 'sequelize';
import type {
  DependencyOfProjectType,
  DripListId,
  ProjectId,
} from '../../common/types';
import GitProjectModel, {
  ProjectVerificationStatus,
} from '../../models/GitProjectModel';
import { FORGES_MAP } from '../../common/constants';
import shouldNeverHappen from '../../utils/shouldNeverHappen';
import RepoDriverSplitReceiverModel, {
  RepoDriverSplitReceiverType,
} from '../../models/RepoDriverSplitReceiverModel';
import { isNftDriverId, isRepoDiverId } from '../../utils/accountIdUtils';

export default async function createDbEntriesForProjectDependency(
  funderAccountId: ProjectId | DripListId,
  projectDependency: DependencyOfProjectType,
  transaction: Transaction,
) {
  const {
    weight,
    accountId: fundeeProjectId,
    source: { forge, ownerName, repoName, url },
  } = projectDependency;

  await GitProjectModel.findOrCreate({
    lock: true,
    transaction,
    where: {
      id: fundeeProjectId,
    },
    defaults: {
      url,
      isValid: true, // There are no receivers yet, so the project is valid.
      splitsJson: null,
      id: fundeeProjectId,
      name: `${ownerName}/${repoName}`,
      ownerName,
      repoName,
      verificationStatus: ProjectVerificationStatus.Unclaimed,
      forge:
        Object.values(FORGES_MAP).find(
          (f) => f.toLocaleLowerCase() === forge.toLowerCase(),
        ) ?? shouldNeverHappen(),
    },
  });

  await RepoDriverSplitReceiverModel.create(
    {
      weight,
      fundeeProjectId,
      type: isNftDriverId(funderAccountId)
        ? RepoDriverSplitReceiverType.DripListDependency
        : RepoDriverSplitReceiverType.ProjectDependency,
      funderDripListId: isNftDriverId(funderAccountId) ? funderAccountId : null,
      funderProjectId: isRepoDiverId(funderAccountId) ? funderAccountId : null,
    },
    { transaction },
  );
}
