import type { UUID } from 'crypto';
import type { Transaction } from 'sequelize';
import type {
  DripsEventSignature,
  EventSignature,
  NftDriverAccountId,
  NftDriverEventSignature,
  ProjectId,
  RepoDriverEventSignature,
} from '../common/types';
import {
  Drips__factory,
  NftDriver__factory,
  RepoDriver__factory,
} from '../../contracts';
import getContractNameByAccountId from './getContractNameByAccountId';

export function assertTransaction(
  transaction: Transaction | null | undefined,
): asserts transaction is Transaction {
  if (!transaction) {
    throw new Error('Transaction is required.');
  }
}

export function assertUUID(uuid: string): asserts uuid is UUID {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!regex.test(uuid)) {
    throw new Error('Not a valid UUID');
  }
}

export function assertRequestId(requestId: string): asserts requestId is UUID {
  const uuidRegExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegExp.test(requestId)) {
    throw new Error(`$Request ID {requestId} is not a valid UUID.`);
  }
}

export function assertEventSignature<T extends EventSignature>(
  eventSignature: string,
  expectedEventSignature: EventSignature,
): asserts eventSignature is T {
  if (eventSignature !== expectedEventSignature) {
    throw new Error(
      `Event signature ${eventSignature} does not match expected event signature ${expectedEventSignature}.`,
    );
  }
}

export function isDripsEvent(
  event: EventSignature,
): event is DripsEventSignature {
  return Drips__factory.createInterface().hasEvent(event);
}

export function isNftDriverEvent(
  event: EventSignature,
): event is NftDriverEventSignature {
  return NftDriver__factory.createInterface().hasEvent(event);
}

export function isRepoDriverEvent(
  event: EventSignature,
): event is RepoDriverEventSignature {
  return RepoDriver__factory.createInterface().hasEvent(event);
}

export default function isProjectId(id: string): id is ProjectId {
  const isNaN = Number.isNaN(Number(id));
  const isRepoDriverId = getContractNameByAccountId(id) === 'repoDriver';

  if (isNaN || !isRepoDriverId) {
    return false;
  }

  return true;
}

export function assertProjectId(id: string): asserts id is ProjectId {
  if (!isProjectId(id)) {
    throw new Error(`Project ID ${id} is not a valid ProjectId.`);
  }
}

export function isNftDriverAccountId(id: string): id is NftDriverAccountId {
  const isNaN = Number.isNaN(Number(id));
  const isAccountIdOfNftDriver = getContractNameByAccountId(id) === 'nftDriver';

  if (isNaN || !isAccountIdOfNftDriver) {
    return false;
  }

  return true;
}

export function assertNftDriverAccountId(
  id: string,
): asserts id is NftDriverAccountId {
  if (!isNftDriverAccountId(id)) {
    throw new Error(`ID ${id} is not a valid NftDriverAccountId.`);
  }
}
