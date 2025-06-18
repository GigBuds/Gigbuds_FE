import { SignalRService } from "./signalrService";

export function handleConnectionCycleCallbacks(service: SignalRService) {
  if (!service) return;

  service.HubConnection!.onclose(async (error: Error | undefined) => {
    service.IsConnected = false;
    console.log("SignalR: Connection closed", error);
    service.triggerCallback("onDisconnected", error);

    // Attempt reconnection if not manually closed (e.g. user closed the browser/app)
    if (error) {
      await service.handleRetryConnection();
    }
  });

  service.HubConnection!.onreconnecting((error: Error | undefined) => {
    console.log("SignalR: Reconnecting...", error);
    service.triggerCallback("onReconnecting", error);
  });

  service.HubConnection!.onreconnected((connectionId: string | undefined) => {
    service.IsConnected = true;
    service.ReconnectAttempts = 0;
    console.log("SignalR: Reconnected", connectionId);
    service.triggerCallback("onReconnected", connectionId);
  });
}
