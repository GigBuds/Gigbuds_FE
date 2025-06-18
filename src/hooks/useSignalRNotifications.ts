import { useCallback, useEffect, useState } from "react";
import signalRService from "../service/signalrService/signalrService";
import { addNotification, selectNotifications } from "@/lib/redux/features/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Notification } from "@/types/notification.types";
import { handleNotificationCallbacks } from "@/service/signalrService/handleNotificationCallbacks";

export const useSignalRNotification = (options = { groups: [], eventHandlers: {} } as { groups: string[], eventHandlers: Record<string, (data: unknown) => void> }) => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();
  const { groups = [], eventHandlers = {} } = options;
  const [connectionStatus, setConnectionStatus] = useState(signalRService.getConnectionStatus());
  
  const updateConnectionStatus = () => {
    setConnectionStatus(signalRService.getConnectionStatus());
  };

  const handleNotification = useCallback((notification: Notification) => {
    const updatedNotifications = [notification, ...notifications.notifications];
    console.log("updatedNotifications", updatedNotifications);
    dispatch(addNotification(updatedNotifications));
  }, [dispatch, notifications.notifications]);

  useEffect(() => {
    const setupEventHandlers = () => {
      // Connection events
      signalRService.registerCallback("onConnected", async () => {
        console.log("onConnected");
        updateConnectionStatus();
      });

      signalRService.registerCallback("onDisconnected", () => {
        console.log("onDisconnected");
        updateConnectionStatus();
      });
      signalRService.registerCallback("onReconnected", () => {
        console.log("onReconnected");
        // Re-join groups after reconnection
        groups.forEach((group) => {
          signalRService.AddToGroup(group);
        });
        updateConnectionStatus();
      });

      signalRService.registerCallback("onReconnecting", updateConnectionStatus);
      signalRService.registerCallback("onConnectionFailed", updateConnectionStatus);
      signalRService.registerCallback("onMaxReconnectAttemptsReached", updateConnectionStatus);

      // Notification events
      signalRService.registerCallback("onNotificationReceived", (data: unknown) => {
        handleNotification(data as Notification);
      });

      // Custom event handlers
      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        signalRService.registerCallback(eventName, handler);
      });
    };
    
    handleNotificationCallbacks(); 
    setupEventHandlers();

    return () => {
      signalRService.removeCallback("onConnected", updateConnectionStatus);
      signalRService.removeCallback("onDisconnected", updateConnectionStatus);
      signalRService.removeCallback("onReconnected", updateConnectionStatus);
      signalRService.removeCallback("onReconnecting", updateConnectionStatus);
      signalRService.removeCallback("onConnectionFailed", updateConnectionStatus);
      signalRService.removeCallback(
        "onMaxReconnectAttemptsReached",
        updateConnectionStatus
      );
      signalRService.removeCallback("onNotificationReceived", (data: unknown) => {
        handleNotification(data as Notification);
      });

      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        signalRService.removeCallback(eventName, handler);
      });

    }
  }, [dispatch, groups, eventHandlers, handleNotification]);

  // Connection control methods
  const connect = useCallback(async () => {
    await signalRService.StartConnection();
  }, []);

  const disconnect = useCallback(async () => {
    await signalRService.StopConnection();
  }, []);

  const joinGroup = useCallback(async (groupName: string) => {
    console.log("Joining group", groupName);
    return await signalRService.AddToGroup(groupName);
  }, []);

  const leaveGroup = useCallback(async (groupName: string) => {
    console.log("Leaving group", groupName);
    return await signalRService.RemoveFromGroup(groupName);
  }, []);

  return { 
    connectionStatus, 

    connect, 
    disconnect,
    joinGroup,
    leaveGroup,

    signalRService
  };
};