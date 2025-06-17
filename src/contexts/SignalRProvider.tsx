"use client";
import { addNotification } from "@/lib/redux/features/notificationSlice";
import { selectUser } from "@/lib/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import signalRService from "@/service/signalrService/signalrService";
import { Notification } from "@/types/notification.types";
import { useEffect } from "react";

export default function SignalRProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const startConnection = async () => {
        if (user.id !== null) {
            await signalRService.StartConnection();
            if (user.role?.includes("Employer")) {
                console.log("SignalR: Add to employer group", user);
                signalRService.AddToGroup("employer");
            } else {
                console.log("SignalR: Add to staff group", user);
                signalRService.AddToGroup("staff");
            }

            signalRService.registerCallback("onNotificationReceived", (data) => {
                const notification = data as Notification;
                dispatch(addNotification([notification]));
            });
        }
        }

        startConnection();
    }, [user, dispatch]);

    useEffect(() => {
        return () => {
            signalRService.StopConnection();
        };
    }, []);

    return <>{children}</>;
}
