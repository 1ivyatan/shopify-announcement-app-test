interface TrackedEvent {
  type: string;
  properties?: any;
}

export const sendEvent = async (eventType: string, eventProperties: any): Promise<void> => {
  const trackedEvent: TrackedEvent = {
    type: eventType,
  };
  if (eventProperties) {
    trackedEvent.properties = eventProperties;
  }
  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackedEvent,
    }),
  });
};
