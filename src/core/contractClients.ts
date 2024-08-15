import type {
  AddressDriver,
  Drips,
  NftDriver,
  RepoDriver,
} from '../../contracts';
import {
  Drips__factory,
  RepoDriver__factory,
  NftDriver__factory,
  AddressDriver__factory,
} from '../../contracts';
import loadChainConfig from '../config/loadChainConfig';
import getProvider from './getProvider';

const { drips, addressDriver, nftDriver, repoDriver } = loadChainConfig();

const provider = getProvider();

export const dripsContract: Drips = Drips__factory.connect(
  drips.address as string,
  provider,
);

export const addressDriverContract: AddressDriver =
  AddressDriver__factory.connect(addressDriver.address as string, provider);

export const nftDriverContract: NftDriver = NftDriver__factory.connect(
  nftDriver.address as string,
  provider,
);

export const repoDriverContract: RepoDriver = RepoDriver__factory.connect(
  repoDriver.address as string,
  provider,
);
