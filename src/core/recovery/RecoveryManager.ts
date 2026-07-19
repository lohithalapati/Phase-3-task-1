import { AppError, ErrorCode } from "../../errors/types/AppError";
import { EventBus, EventTypes } from "../events/EventBus";
import { Logger } from "../logging/Logger";

export interface IRecoveryStrategy {
  canHandle(error: AppError): boolean;
  execute(error: AppError): Promise<boolean>;
}

export class ReloadStrategy implements IRecoveryStrategy {
  public canHandle(error: AppError): boolean {
    return error.context?.action === "force-reload";
  }

  public async execute(error: AppError): Promise<boolean> {
    Logger.warn("[Recovery] Invoking browser hard-reload recovery sequence", { error });
    window.location.reload();
    return true;
  }
}

export class ReauthenticateStrategy implements IRecoveryStrategy {
  public canHandle(error: AppError): boolean {
    return error.code === ErrorCode.UNAUTHORIZED;
  }

  public async execute(error: AppError): Promise<boolean> {
    Logger.warn("[Recovery] Detecting auth expiration. Dispatched logouts.", { error });
    EventBus.publish(EventTypes.AUTH_EXPIRED, { error }, "RecoveryManager");
    return true;
  }
}

class RecoveryEngine {
  private static instance: RecoveryEngine;
  private strategies: IRecoveryStrategy[] = [];

  private constructor() {
    this.registerStrategy(new ReloadStrategy());
    this.registerStrategy(new ReauthenticateStrategy());
  }

  public static getInstance(): RecoveryEngine {
    if (!RecoveryEngine.instance) {
      RecoveryEngine.instance = new RecoveryEngine();
    }
    return RecoveryEngine.instance;
  }

  public registerStrategy(strategy: IRecoveryStrategy): void {
    this.strategies.push(strategy);
  }

  public async handleRecovery(error: AppError): Promise<boolean> {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(error)) {
        try {
          const success = await strategy.execute(error);
          if (success) {
            Logger.info(`[Recovery] Recovery transaction fulfilled using: ${strategy.constructor.name}`);
            return true;
          }
        } catch (strategyError) {
          Logger.error(`[Recovery] Failure executing strategy ${strategy.constructor.name}`, { strategyError });
        }
      }
    }
    return false;
  }
}

export const RecoveryManager = RecoveryEngine.getInstance();