import * as signalR from "@microsoft/signalr";
import { handleNotificationCallbacks } from "./handleNotificationCallbacks";
import { BaseSignalRService } from "../base";
import Cookies from "js-cookie";

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? 'https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/hub/notifications';
console.log("SignalR: HUB_URL", HUB_URL);

export class NotificationSignalRService extends BaseSignalRService {
  constructor() {
    super();
  }

  // -------------------------- MAIN CONNECTION FUNCTIONS -------------------------------------------

  async StartConnection() {
    if (this.isConnected || this.isConnecting) {
      console.log("NotificationSignalRService: Already connected or connecting");
      return;
    }

    try {
      console.log("NotificationSignalRService: Starting connection");
      this.isConnecting = true;
      const accessToken = Cookies.get('access_token');
      console.log("NotificationSignalRService: Access token", accessToken);
      this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
            accessTokenFactory: () => Promise.resolve(accessToken ?? ''),
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              if (retryContext.previousRetryCount === 0) {
                return 0;
              }
              return Math.min(
                1000 * Math.pow(2, retryContext.previousRetryCount),
                30000
              );
            },
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();

      // set up connection lifecycle event handlers
      this.handleConnectionCycleCallbacks();

      handleNotificationCallbacks();

      // start connection
      await this.hubConnection.start();

      // wait for connection to be established else "Cannot send data if the connection is not in the 'Connected' State."
      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      console.log("NotificationSignalRService: Connected successfully");
      this.triggerCallback("onConnected");
    } catch (error) {
      console.error("NotificationSignalRService: Connection failed", error);
      this.triggerCallback("onConnectionFailed", error);
      this.isConnected = false;

      this.handleRetryConnection();
    }
  }

}

const notificationSignalRService = new NotificationSignalRService();
export default notificationSignalRService;

