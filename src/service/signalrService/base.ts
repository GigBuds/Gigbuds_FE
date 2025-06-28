import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

export abstract class BaseSignalRService {
  protected hubConnection: signalR.HubConnection | null;
  protected isConnected: boolean;
  protected isConnecting: boolean;
  protected reconnectAttempts: number;
  protected readonly maxReconnectAttempts: number;
  protected readonly reconnectDelay: number;
  protected readonly notificationCallbacks: Map<string, ((data: unknown) => void)[]>;
  protected readonly connectionCallbacks: Map<string, ((data: unknown) => void)[]>;

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

  // Abstract method to be implemented by specific services
  abstract StartConnection(): Promise<void>;

  // Set up connection lifecycle event handlers
  protected handleConnectionCycleCallbacks() {
    if (!this.hubConnection) return;

    this.hubConnection.onclose(async (error: Error | undefined) => {
      this.isConnected = false;
      console.log("SignalR: Connection closed", error);
      this.triggerCallback("onDisconnected", error);

      // Attempt reconnection if not manually closed (e.g. user closed the browser/app)
      if (error) {
        await this.handleRetryConnection();
      }
    });

    this.hubConnection.onreconnecting((error: Error | undefined) => {
      console.log("SignalR: Reconnecting...", error);
      this.triggerCallback("onReconnecting", error);
    });

    this.hubConnection.onreconnected((connectionId: string | undefined) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("SignalR: Reconnected", connectionId);
      this.triggerCallback("onReconnected", connectionId);
    });
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