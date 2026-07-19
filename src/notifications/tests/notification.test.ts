import { NotificationPriorityQueue } from "../queue/PriorityQueue";
import { NotificationChannel, NotificationItem, NotificationPriority, NotificationState } from "../types/Notification";
import { notificationStore } from "../center/NotificationStore";
import { EventBus, EventTypes } from "../../core/events/EventBus";
import { NotificationPipeline } from "../pipeline/NotificationPipeline";

describe("Task 9: Enterprise Notification Platform", () => {
  beforeEach(() => {
    notificationStore.clearAll();
    EventBus.clear();
  });

  test("Priority Queue sorts items correctly by Priority then Timestamp", () => {
    const queue = new NotificationPriorityQueue();

    const low: NotificationItem = {
      id: "1",
      title: "Low Event",
      message: "Test message",
      priority: NotificationPriority.LOW,
      channels: [NotificationChannel.IN_APP],
      state: NotificationState.UNREAD,
      timestamp: 100,
    };

    const critical: NotificationItem = {
      id: "2",
      title: "Critical Event",
      message: "Critical Error payload",
      priority: NotificationPriority.CRITICAL,
      channels: [NotificationChannel.IN_APP],
      state: NotificationState.UNREAD,
      timestamp: 150,
    };

    const high: NotificationItem = {
      id: "3",
      title: "High Event",
      message: "High urgency",
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP],
      state: NotificationState.UNREAD,
      timestamp: 200,
    };

    queue.enqueue(low);
    queue.enqueue(critical);
    queue.enqueue(high);

    expect(queue.peek()?.id).toBe("2");
    expect(queue.dequeue()?.id).toBe("2");
    expect(queue.dequeue()?.id).toBe("3");
  });

  test("Store modifications accurately transition states", () => {
    const item: NotificationItem = {
      id: "tx-7",
      title: "Active State Test",
      message: "Testing local states",
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP],
      state: NotificationState.UNREAD,
      timestamp: Date.now(),
    };

    notificationStore.add(item);
    expect(notificationStore.getState().unreadCount).toBe(1);

    notificationStore.updateState("tx-7", NotificationState.READ);
    expect(notificationStore.getState().unreadCount).toBe(0);
    expect(notificationStore.getState().items[0].state).toBe(NotificationState.READ);
  });

  test("EventBus publish integration propagates transparently through pipeline", () => {
    NotificationPipeline.initialize();

    EventBus.publish(
      EventTypes.NOTIFICATION_DISPATCH,
      {
        title: "Dispatched direct event",
        message: "Dynamic validation logic run complete",
        priority: NotificationPriority.HIGH,
        channels: [NotificationChannel.IN_APP],
      },
      "TestRunner"
    );

    const storeItems = notificationStore.getState().items;
    expect(storeItems.length).toBe(1);
    expect(storeItems[0].title).toBe("Dispatched direct event");
    expect(storeItems[0].priority).toBe(NotificationPriority.HIGH);
  });
});