"use client";
import logo from "../../../public/Gigbuds Logo.png";
import Image from "next/image";
import { Notification } from "@/types/notification.types";
// Time utility function


const NotificationSection = ({ notifications }: { notifications: Notification[] }) => {

    const getTimeAgo = (timestamp: string): string => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMilliseconds = now.getTime() - notificationTime.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);

        if (diffInMinutes < 1) {
            return 'Vừa xong';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ngày trước`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks} tuần trước`;
        } else {
            return `${diffInMonths} tháng trước`;
        }
    };

    return (
        <div className="pl-2 flex items-center justify-center flex-col w-full h-full pt-[5%]">
            <div className="text-xl font-bold">
                Thông báo của bạn
            </div>
            <div className="flex flex-col w-full overflow-y-auto h-[90vh]">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="shadow-md px-1 py-3 flex flex-row items-center gap-4"
                    >
                        <Image
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 rounded-full mb-2"
                            style={{ objectFit: "cover" }}
                        />
                        <div>
                            <h3 className="text-md font-semibold line-clamp-1">{notification.title}</h3>
                            <div>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    {notification.content}
                                </p>
                            </div>

                            <p className="text-[80%] text-gray-500">
                                {getTimeAgo(notification.timestamp.toString())}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSection;