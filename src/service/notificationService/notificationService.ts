import api from "@/api/api";
import { Notification } from "@/types/notification.types";

class NotificationService {
  static async getStoredNotifications(): Promise<Notification[]> {
    try {
      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        return JSON.parse(storedNotifications);
      }
      return [];
    } catch (error) {
      console.error("Error getting stored notifications", error);
      throw error;
    }
  }

  static async getMissedNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/stored/web/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting stored notifications", error);
      throw error;
    }
  }

  static async getNotifications(page: number, limit: number, userId: number): Promise<Notification[]> {
    try {
      const response = await api.get(
        `/notifications?page=${page}&limit=${limit}&userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting notifications", error);
      throw error;
    }
  }

  static async markAsRead(notificationIds: string[]): Promise<void> {
    try {
      const response = await api.put(`/notifications/read`, {
        notificationIds: notificationIds,
      });
      return response.json();
    } catch (error) {
      console.error("Error marking notification as read", error);
      throw error;
    }
  }

}

export default NotificationService;
