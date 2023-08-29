import type { Model } from 'sequelize';
import type { AddressLike } from 'ethers';
import type { UUID } from 'crypto';
import { randomUUID } from 'crypto';
import type { Drips, RepoDriver } from '../../contracts';
import type {
  DRIPS_CONTRACT_NAMES,
  FORGES_MAP,
  SUPPORTED_NETWORKS,
} from './constants';
import type { TypedEventLog } from '../../contracts/common';
import type EventHandlerBase from './EventHandlerBase';

export type IpfsHash = string & { __brand: 'IpfsHash' };
export type ProjectId = string & { __brand: 'ProjectId' };

export type ValuesOf<T> = T[keyof T];

export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: unknown;
    };

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

export type DbSchema = SupportedNetwork & { __brand: 'dbSchema' };

export type Forge = ValuesOf<typeof FORGES_MAP>;

export type DripsContract = (typeof DRIPS_CONTRACT_NAMES)[number];

export type ChainConfig = {
  [K in DripsContract]: {
    address: AddressLike;
    block: number;
  };
};

// ! DO NOT EXPORT THESE. It will fail in runtime. This is a hack to get the filter types.
const _dripsFilters = ({} as Drips).filters;
const _repoDriverFilters = ({} as RepoDriver).filters;
const _allFilters = { ..._dripsFilters, ..._repoDriverFilters };

export type DripsContractEvent = ValuesOf<typeof _dripsFilters>;
export type RepoDriverContractEvent = ValuesOf<typeof _repoDriverFilters>;

type EventSignaturePattern = `${string}(${string})`;

export type DripsEventSignature = {
  [T in keyof typeof _dripsFilters]: T extends string
    ? T extends EventSignaturePattern
      ? T
      : never
    : never;
}[keyof typeof _dripsFilters];

export type RepoDriverEventSignature = {
  [T in keyof typeof _repoDriverFilters]: T extends string
    ? T extends EventSignaturePattern
      ? T
      : never
    : never;
}[keyof typeof _repoDriverFilters];

export type EventSignature = DripsEventSignature | RepoDriverEventSignature;

export type EventSignatureToEventMap = {
  [K in EventSignature]: (typeof _allFilters)[K];
};

export type DripsEvent = ValuesOf<EventSignatureToEventMap>;

export class HandleRequest<T extends EventSignature> {
  public readonly id: UUID = randomUUID();
  public readonly eventLog: TypedEventLog<EventSignatureToEventMap[T]>;

  constructor(eventLog: TypedEventLog<EventSignatureToEventMap[T]>) {
    this.eventLog = eventLog;
  }
}

export type ModelStaticMembers = {
  new (): Model;
  initialize(): void;
};

export type EventHandlerConstructor<T extends EventSignature> = {
  new (): EventHandlerBase<T>;
};

export interface IEventModel {
  rawEvent: string;
  logIndex: number;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
}
