import { AppError } from "../../errors/types/AppError";
import { EventBus, EventTypes } from "../events/EventBus";

export interface IObservabilityAdapter {
  trackException(error: AppError): void;
  trackMetric(name: string, value: number, tags?: Record<string, string>): void;
}

class ObservabilityManager {
  private static instance: ObservabilityManager;
  private adapters: Set<IObservabilityAdapter> = new Set();

  private constructor() {}

  public static getInstance(): ObservabilityManager {
    if (!ObservabilityManager.instance) {
      ObservabilityManager.instance = new ObservabilityManager();
    }
    return ObservabilityManager.instance;
  }

  public registerAdapter(adapter: IObservabilityAdapter): void {
    this.adapters.add(adapter);
  }

  public trackException(error: AppError): void {
    this.adapters.forEach((adapter) => {
      try {
        adapter.trackException(error);
      } catch (e) {
        console.error("[Observability] Adapter trackException failed", e);
      }
    });

    EventBus.publish(
      EventTypes.TELEMETRY_TRACKED,
      { type: "EXCEPTION", name: error.name, code: error.code },
      "ObservabilityManager"
    );
  }

  public trackMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.adapters.forEach((adapter) => {
      try {
        adapter.trackMetric(name, value, tags);
      } catch (e) {
        console.error("[Observability] Adapter trackMetric failed", e);
      }
    });

    EventBus.publish(
      EventTypes.TELEMETRY_TRACKED,
      { type: "METRIC", name, value, tags },
      "ObservabilityManager"
    );
  }
}

export const Observability = ObservabilityManager.getInstance();