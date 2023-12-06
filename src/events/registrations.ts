import logger from '../core/logger';
import {
  OwnerUpdateRequestedEventHandler,
  TransferEventHandler,
} from '../eventHandlers';
import AccountMetadataEmittedEventHandler from '../eventHandlers/AccountMetadataEmittedEvent/AccountMetadataEmittedEventHandler';
import GivenEventHandler from '../eventHandlers/GivenEventHandler';
import OwnerUpdatedEventHandler from '../eventHandlers/OwnerUpdatedEventHandler';
import { removeAllListeners } from '../utils/contractUtils';
import {
  getEventHandler,
  getRegisteredEvents,
  registerEventHandler,
} from './eventHandlerUtils';

export function registerEventHandlers(): void {
  registerEventHandler<'OwnerUpdateRequested(uint256,uint8,bytes)'>(
    'OwnerUpdateRequested(uint256,uint8,bytes)',
    OwnerUpdateRequestedEventHandler,
  );
  registerEventHandler<'OwnerUpdated(uint256,address)'>(
    'OwnerUpdated(uint256,address)',
    OwnerUpdatedEventHandler,
  );
  registerEventHandler<'AccountMetadataEmitted(uint256,bytes32,bytes)'>(
    'AccountMetadataEmitted(uint256,bytes32,bytes)',
    AccountMetadataEmittedEventHandler,
  );
  registerEventHandler<'Transfer(address,address,uint256)'>(
    'Transfer(address,address,uint256)',
    TransferEventHandler,
  );
  registerEventHandler<'Given(uint256,uint256,address,uint128)'>(
    'Given(uint256,uint256,address,uint128)',
    GivenEventHandler,
  );
}

let intervalId: NodeJS.Timeout | null = null;

// We need to re-register event listeners because we were getting `filter not found` errors after a while.
// See more: https://docs.chainstack.com/docs/understanding-ethereums-filter-not-found-error-and-how-to-fix-it
export async function registerEventListeners(): Promise<void> {
  await removeAllListeners();

  const registeredEvents = getRegisteredEvents();
  for (const eventSignature of registeredEvents) {
    const handler = getEventHandler(eventSignature);
    await handler.registerEventListener();
  }

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(
    async () => {
      await registerEventListeners();
      logger.info('Re-registered event listeners.');
    },
    5 * 60 * 1000,
  ); // 5 minutes
}
