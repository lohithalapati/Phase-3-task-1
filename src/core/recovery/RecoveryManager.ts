import { EventBus, EventTypes } from '../events/EventBus';
import { Logger } from '../logging/Logger';

export enum RecoveryAction {
  RETRY = 'RETRY',
  RELOAD = 'RELOAD',
  REDIRECT = 'REDIRECT',
  REAUTHENTICATE = 'REAUTHENTICATE',
  GO_HOME = 'GO_HOME'
}

export class RecoveryManager {
  static execute(errorKind: string): void {
    try {
      const action = RecoveryManager.resolveAction(errorKind);
      Logger.info('[Recovery] Recovery transaction fulfilled using: ' + action);
      RecoveryManager.dispatch(action);
    } catch (strategyError) {
      Logger.error('[Recovery] Failure executing strategy', { strategyError });
    }
  }

  static handleRecovery(errorKind: string): void {
    RecoveryManager.execute(errorKind);
  }

  private static resolveAction(kind: string): RecoveryAction {
    switch (kind) {
      case 'AUTH':
        return RecoveryAction.REAUTHENTICATE;
      case 'NETWORK':
        return RecoveryAction.RETRY;
      case 'NOT_FOUND':
        return RecoveryAction.GO_HOME;
      default:
        return RecoveryAction.RELOAD;
    }
  }

  private static dispatch(action: RecoveryAction): void {
    if (action === RecoveryAction.REAUTHENTICATE) {
      EventBus.publish(
        EventTypes.AUTH_SESSION_EXPIRED,
        { reason: 'recovery' },
        'RecoveryManager'
      );
    }
  }
}