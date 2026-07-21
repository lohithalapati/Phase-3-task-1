# Event Flow Diagram — NeuralHandoff V5

## Overview
All cross-module communication flows exclusively through the EventBus.
No module may import another module's internals directly.

## Event Flow
\\\
Application Action
        |
        v
  EventBus.publish(EventTypes.SOME_EVENT, payload)
        |
        v
  EventBus (EventBusImpl)
        |
        +---> NotificationPipeline.subscribe()
        |           |
        |           v
        |     ChannelRouter.route()
        |           |
        |           v
        |     ToastHost / NotificationCenter
        |
        +---> ErrorPipeline.subscribe()
                    |
                    v
              Logger + Recovery
\\\

## Registered Events
| Event Name              | Published By     | Consumed By              |
|------------------------|-----------------|--------------------------|
| SYSTEM_ERROR           | ErrorPipeline   | NotificationPipeline     |
| NOTIFICATION_DISPATCH  | Any Module      | NotificationPipeline     |
| AUDIT_ACTION           | Any Module      | NotificationPipeline     |

## Rules
- Every event must be published through EventBus.publish()
- Every consumer must use EventBus.subscribe()
- Unsubscribe functions must be called on component unmount
- No module may call another module's handler directly
