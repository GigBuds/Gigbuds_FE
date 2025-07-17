"use client";
import { addNotification } from "@/lib/redux/features/notificationSlice";
import { selectUser } from "@/lib/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import notificationSignalRService from "@/service/signalrService/notifications/notificationSignalrService";
import { Notification } from "@/types/notification.types";
import { useEffect } from "react";

export function SignalRProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const startConnection = async () => {
            if (user.id !== null) {
                await notificationSignalRService.StartConnection();
                if (user.roles?.includes("Employer")) {
                    console.log("SignalR: Add to employer group", user);
                    notificationSignalRService.AddToGroup("employer");
                } else {
                    console.log("SignalR: Add to staff group", user);
                    notificationSignalRService.AddToGroup("staff");
                }

                notificationSignalRService.registerCallback("onNotificationReceived", (data) => {
                    const notification = data as Notification;
                    dispatch(addNotification([notification]));
                });
            }
        }

        startConnection();

        return () => {
            notificationSignalRService.removeCallback("onNotificationReceived", (data) => {
                const notification = data as Notification;
                dispatch(addNotification([notification]));
            });
        }
    }, [user, dispatch]);

    useEffect(() => {
        return () => {
            notificationSignalRService.StopConnection();
        };
    }, []);

    return <>{children}</>;
}
