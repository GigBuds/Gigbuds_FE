import * as signalR from "@microsoft/signalr";
import { handleConnectionCycleCallbacks } from "./handleConnectionCycleCallbacks";
import { HubConnection } from "@microsoft/signalr";
import { handleNotificationCallbacks } from "./handleNotificationCallbacks";

const HUB_URL = process.env.HUB_URL ?? 'https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/hub/notifications';
console.log("SignalR: HUB_URL", HUB_URL);



export class SignalRService {
  private hubConnection: signalR.HubConnection | null;
  private isConnected: boolean;
  private isConnecting: boolean;
  private reconnectAttempts: number;
  private readonly maxReconnectAttempts: number;
  private readonly reconnectDelay: number;
  private readonly notificationCallbacks: Map<string, ((data: unknown) => void)[]>;
  private readonly connectionCallbacks: Map<string, ((data: unknown) => void)[]>;

  constructor() {
    // Connection object for SignalR when connected to the server
    this.hubConnection = null;

    // Connection status
    this.isConnected = false;
    this.isConnecting = false;

    // Reconnect attempts
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5; 
    this.reconnectDelay = 5000; 

    // Notification & connection lifecycle callbacks
    this.notificationCallbacks = new Map();
    this.connectionCallbacks = new Map();
  }

  // -------------------------- MAIN CONNECTION FUNCTIONS -------------------------------------------

  async StartConnection() {
    if (this.isConnected || this.isConnecting) {
      console.log("SignalR: Already connected or connecting");
      return;
    }

    try {
      console.log("SignalR: Starting connection");
      this.isConnecting = true;

      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      console.log("SignalR: Access token", accessToken);
      this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
            accessTokenFactory: () => accessToken ?? "",
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
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
      handleConnectionCycleCallbacks(this);

      handleNotificationCallbacks();

      await this.hubConnection.start();

      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for connection to finish establishing

      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      console.log("SignalR: Connected successfully");
      this.triggerCallback("onConnected");
    } catch (error) {
      console.error("SignalR: Connection failed", error);
      this.triggerCallback("onConnectionFailed", error);
      this.isConnected = false;

      this.handleRetryConnection();
    }
  }

  async handleRetryConnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("SignalR: Max reconnect attempts reached");
      this.triggerCallback("onMaxReconnectAttemptsReached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`SignalR: Reconnecting... (attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);

    setTimeout(async () => {
      await this.StartConnection();
    }, this.reconnectDelay);
  }

  async StopConnection() {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.isConnected = false;
        console.log("SignalR: Connection stopped");
      } catch (error) {
        console.error("SignalR: Error stopping connection", error);
      }
    }
  }

  // -------------------------- HELPER FUNCTIONS -------------------------------------------

  async AddToGroup(groupName: string) {
    if (!this.isConnected) {
      console.error("SignalR: Not connected to the server");
      return;
    }

    try {
      await this.hubConnection!.invoke("AddToGroup", groupName);
      console.log(`SignalR: Added to group ${groupName}`);
    } catch (error) {
      console.error("SignalR: Error adding to group", error);
      throw error;
    }
  }

  async RemoveFromGroup(groupName: string) {
    if (!this.isConnected) {
      console.error("SignalR: Not connected to the server");
      return;
    }

    try {
      await this.hubConnection!.invoke("RemoveFromGroup", groupName);
      console.log(`SignalR: Removed from group ${groupName}`);
    } catch (error) {
      console.error("SignalR: Error removing from group", error);
      throw error;
    }
  }

  // Trigger a list of callbacks for a given event name
  triggerCallback(eventName: string, data: unknown = null) {
    if (this.connectionCallbacks.has(eventName)) {
      const callbacks = this.connectionCallbacks.get(eventName);
      if (callbacks) {
        callbacks.forEach((callback: (data: unknown) => void) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`SignalR: Error in ${eventName} callback:`, error);
          }
        });
      }
    }
  }

  registerCallback(eventName: string, callback: (data: unknown) => void) {
    if (!this.connectionCallbacks.has(eventName)) {
      this.connectionCallbacks.set(eventName, []);
    }
    this.connectionCallbacks.get(eventName)!.push(callback);
  }

  removeCallback(eventName: string, callback: (data: unknown) => void) {
    if (this.connectionCallbacks.has(eventName)) {
      const callbacks = this.connectionCallbacks.get(eventName);
      if (callbacks) {
        this.connectionCallbacks.set(eventName, callbacks.filter((cb) => cb !== callback));
      }
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      connectionId: this.hubConnection?.connectionId ?? null,
    };
  }

  // -------------------------- GETTERS -------------------------------------------

  get HubConnection(): HubConnection | null {
    return this.hubConnection;
  }

  get IsConnected(): boolean {
    return this.isConnected;
  }

  get IsConnecting(): boolean {
    return this.isConnecting;
  }

  get ReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  // -------------------------- SETTERS -------------------------------------------

  set IsConnected(value: boolean) {
    this.isConnected = value;
  }

  set IsConnecting(value: boolean) {
    this.isConnecting = value;
  }

  set ReconnectAttempts(value: number) {
    this.reconnectAttempts = value;
  } 
}

const signalRService = new SignalRService();
export default signalRService;

