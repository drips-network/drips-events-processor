import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketProvider } from 'ethers';
import type { ChainConfig, SupportedNetwork } from '../common/types';
import { SUPPORTED_NETWORKS } from '../common/constants';
import logger from '../common/logger';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function getWebSocketProvider(
  network: SupportedNetwork,
): Promise<WebSocketProvider> {
  const url = `wss://${network}.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;

  return new WebSocketProvider(url);
}

export const DEFAULT_NETWORK = 'sepolia';

export function getNetwork(): SupportedNetwork {
  const network = process.env.NETWORK as SupportedNetwork;

  if (!network) {
    return DEFAULT_NETWORK;
  }

  if (!SUPPORTED_NETWORKS.includes(network)) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return network;
}

export async function getNetworkSettings(): Promise<{
  provider: WebSocketProvider;
  network: SupportedNetwork;
  chainConfig: ChainConfig;
}> {
  const network = getNetwork();

  try {
    const fileNameWithExtension = `${network}.json`;
    const rootDir = path.resolve(__dirname, '..');
    const filePath = path.join(rootDir, 'config', fileNameWithExtension);

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const jsonObject: ChainConfig = JSON.parse(fileContent);

    const provider = await getWebSocketProvider(network);

    const settings = {
      provider,
      network,
      chainConfig: jsonObject,
    };

    return settings;
  } catch (error) {
    logger.error(`Error reading ${network} config file: ${error}`);
    throw error;
  }
}
