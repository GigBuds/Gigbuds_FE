import { useCallback, useEffect, useState } from "react";
import notificationSignalrService from "../service/signalrService/notifications/notificationSignalrService";
import { addNotification, selectNotifications } from "@/lib/redux/features/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Notification } from "@/types/notification.types";
import { handleNotificationCallbacks } from "@/service/signalrService/notifications/handleNotificationCallbacks";

export const useSignalRNotification = (options = { groups: [], eventHandlers: {} } as { groups: string[], eventHandlers: Record<string, (data: unknown) => void> }) => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();
  const { groups = [], eventHandlers = {} } = options;
  const [connectionStatus, setConnectionStatus] = useState(notificationSignalrService.getConnectionStatus());
  
  const updateConnectionStatus = () => {
    setConnectionStatus(notificationSignalrService.getConnectionStatus());
  };

  const handleNotification = useCallback((notification: Notification) => {
    const updatedNotifications = [notification, ...notifications.notifications];
    console.log("updatedNotifications", updatedNotifications);
    dispatch(addNotification(updatedNotifications));
  }, [dispatch, notifications.notifications]);

  useEffect(() => {
    const setupEventHandlers = () => {
      // Connection events
      notificationSignalrService.registerCallback("onConnected", async () => {
        console.log("onConnected");
        updateConnectionStatus();
      });

      notificationSignalrService.registerCallback("onDisconnected", () => {
        console.log("onDisconnected");
        updateConnectionStatus();
      });
      notificationSignalrService.registerCallback("onReconnected", () => {
        console.log("onReconnected");
        // Re-join groups after reconnection
        groups.forEach((group) => {
          notificationSignalrService.AddToGroup(group);
        });
        updateConnectionStatus();
      });

      notificationSignalrService.registerCallback("onReconnecting", updateConnectionStatus);
      notificationSignalrService.registerCallback("onConnectionFailed", updateConnectionStatus);
      notificationSignalrService.registerCallback("onMaxReconnectAttemptsReached", updateConnectionStatus);

      // Notification events
      notificationSignalrService.registerCallback("onNotificationReceived", (data: unknown) => {
        handleNotification(data as Notification);
      });

      // Custom event handlers
      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        notificationSignalrService.registerCallback(eventName, handler);
      });
    };
    
    handleNotificationCallbacks(); 
    setupEventHandlers();

    return () => {
      notificationSignalrService.removeCallback("onConnected", updateConnectionStatus);
      notificationSignalrService.removeCallback("onDisconnected", updateConnectionStatus);
      notificationSignalrService.removeCallback("onReconnected", updateConnectionStatus);
      notificationSignalrService.removeCallback("onReconnecting", updateConnectionStatus);
      notificationSignalrService.removeCallback("onConnectionFailed", updateConnectionStatus);
      notificationSignalrService.removeCallback(
        "onMaxReconnectAttemptsReached",
        updateConnectionStatus
      );
      notificationSignalrService.removeCallback("onNotificationReceived", (data: unknown) => {
        handleNotification(data as Notification);
      });

      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        notificationSignalrService.removeCallback(eventName, handler);
      });

    }
  }, [dispatch, groups, eventHandlers, handleNotification]);

  // Connection control methods
  const connect = useCallback(async () => {
    await notificationSignalrService.StartConnection();
  }, []);

  const disconnect = useCallback(async () => {
    await notificationSignalrService.StopConnection();
  }, []);

  const joinGroup = useCallback(async (groupName: string) => {
    console.log("Joining group", groupName);
    return await notificationSignalrService.AddToGroup(groupName);
  }, []);

  const leaveGroup = useCallback(async (groupName: string) => {
    console.log("Leaving group", groupName);
    return await notificationSignalrService.RemoveFromGroup(groupName);
  }, []);

  return { 
    connectionStatus, 

    connect, 
    disconnect,
    joinGroup,
    leaveGroup,

    notificationSignalrService
  };
};