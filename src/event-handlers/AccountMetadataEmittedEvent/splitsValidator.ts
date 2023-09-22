import type { SplitsReceiverStruct } from '../../../contracts/Drips';
import type { DripListId, ProjectId } from '../../common/types';
import { getDripsClient } from '../../utils/contractClientUtils';

export default async function areReceiversValid(
  accountId: ProjectId | DripListId,
  splits: SplitsReceiverStruct[],
): Promise<boolean> {
  const drips = await getDripsClient();
  const formattedSplits = formatSplitReceivers(splits);
  const metadataReceiversHash = await drips.hashSplits(formattedSplits);
  const onChainReceiversHash = await drips.splitsHash(accountId);

  if (metadataReceiversHash !== onChainReceiversHash) {
    return false;
  }

  return true;
}

function formatSplitReceivers(
  receivers: SplitsReceiverStruct[],
): SplitsReceiverStruct[] {
  // Splits receivers must be sorted by user ID, deduplicated, and without weights <= 0.

  const uniqueReceivers = receivers.reduce(
    (unique: SplitsReceiverStruct[], o) => {
      if (
        !unique.some(
          (obj: SplitsReceiverStruct) =>
            obj.accountId === o.accountId && obj.weight === o.weight,
        )
      ) {
        unique.push(o);
      }
      return unique;
    },
    [],
  );

  const sortedReceivers = uniqueReceivers.sort((a, b) =>
    // Sort by user ID.
    // eslint-disable-next-line no-nested-ternary
    BigInt(a.accountId) > BigInt(b.accountId)
      ? 1
      : BigInt(a.accountId) < BigInt(b.accountId)
      ? -1
      : 0,
  );

  return sortedReceivers;
}