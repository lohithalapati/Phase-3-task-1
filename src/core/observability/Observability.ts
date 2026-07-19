import { EventBus, EventTypes } from '../events/EventBus';

export interface IObservabilityAdapter {
  trackMetric(name: string, value: number, tags?: Record<string, string>): void;
  trackException(error: Error, context?: Record<string, any>): void;
  startTrace(spanName: string): () => void;
}

export class ObservabilityAdapter implements IObservabilityAdapter {
  trackMetric(name: string, value: number, tags?: Record<string, string>): void {
    // Abstraction point: Datadog / Azure App Insights / OpenTelemetry
    EventBus.publish(
      EventTypes.TELEMETRY_TRACKED,
      { name, value, tags },
      'ObservabilityAdapter'
    );
  }

  trackException(error: Error, context?: Record<string, any>): void {
    // Abstraction point: Sentry / Datadog / Azure App Insights
    EventBus.publish(
      EventTypes.TELEMETRY_TRACKED,
      { exception: error.message, stack: error.stack, context },
      'ObservabilityAdapter'
    );
  }

  startTrace(spanName: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      EventBus.publish(
        EventTypes.TELEMETRY_TRACKED,
        { spanName, duration },
        'ObservabilityAdapter'
      );
    };
  }
}

export const Observability = new ObservabilityAdapter();