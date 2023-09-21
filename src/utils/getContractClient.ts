import {
  Drips__factory,
  RepoDriver__factory,
  NftDriver__factory,
} from '../../contracts';
import type { NftDriver, Drips, RepoDriver } from '../../contracts';
import { getNetworkSettings } from './getNetworkSettings';

export async function getDrips(): Promise<Drips> {
  const {
    provider,
    chainConfig: { drips },
  } = await getNetworkSettings();

  return Drips__factory.connect(drips.address as string, provider);
}

export async function getNftDriver(): Promise<NftDriver> {
  const {
    provider,
    chainConfig: { nftDriver },
  } = await getNetworkSettings();

  return NftDriver__factory.connect(nftDriver.address as string, provider);
}

export async function getRepoDriver(): Promise<RepoDriver> {
  const {
    provider,
    chainConfig: { repoDriver },
  } = await getNetworkSettings();

  return RepoDriver__factory.connect(repoDriver.address as string, provider);
}