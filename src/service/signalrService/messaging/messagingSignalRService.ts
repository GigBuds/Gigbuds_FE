import * as signalR from "@microsoft/signalr";
import { handleMessagingCallbacks } from "./handleMessagingCallbacks";
import { BaseSignalRService } from "../base";
import Cookies from "js-cookie";

const HUB_URL = process.env.NEXT_PUBLIC_MESSAGING_HUB_URL ?? 'https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/hub/messaging';
console.log("MessagingSignalRService: HUB_URL", HUB_URL);

export class MessagingSignalRService extends BaseSignalRService {
  constructor() {
    super();
  }

  // -------------------------- MAIN CONNECTION FUNCTIONS -------------------------------------------

  async StartConnection() {
    if (this.isConnected || this.isConnecting) {
      console.log("MessagingSignalRService: Already connected or connecting");
      return;
    }

    try {
      console.log("MessagingSignalRService: Starting connection");
      this.isConnecting = true;
      const accessToken = Cookies.get('access_token');
      console.log("MessagingSignalRService: Access token", accessToken);
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

      handleMessagingCallbacks();

      // start connection
      await this.hubConnection.start();

      // wait for connection to be established else "Cannot send data if the connection is not in the 'Connected' State."
      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      console.log("MessagingSignalRService: Connected successfully");
      this.triggerCallback("onConnected");
    } catch (error) {
      console.error("MessagingSignalRService: Connection failed", error);
      this.triggerCallback("onConnectionFailed", error);
      this.isConnected = false;

      this.handleRetryConnection();
    }
  }
}

const messagingSignalRService = new MessagingSignalRService();
export default messagingSignalRService;

