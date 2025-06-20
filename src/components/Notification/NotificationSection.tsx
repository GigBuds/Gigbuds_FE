"use client";
import logo from "../../../public/Gigbuds Logo.png";
import Image from "next/image";
import { Notification } from "@/types/notification.types";

import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Separator } from "../../../ui/separator";
import { Bell, Clock, User, Briefcase, MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const NotificationSection = ({ notifications }: { notifications: Notification[] }) => {
    const router = useRouter();

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

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "profile":
                return <User className="h-4 w-4" />;
            case "application":
                return <Briefcase className="h-4 w-4" />;
            case "feedback":
                return <MessageSquare className="h-4 w-4" />;
            case "job":
                return <Star className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getNotificationBadgeVariant = (type: string) => {
        switch (type) {
            case "profile":
                return "secondary" as const;
            case "application":
                return "default" as const;
            case "feedback":
                return "outline" as const;
            case "job":
                return "default" as const;
            default:
                return "secondary" as const;
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        switch (notification.type) {
            case "profile":
                // TODO: Add profile navigation when profile page is available
                console.log("Profile notification clicked", notification);
                break;
            case "application":
                const jobId = notification.additionalPayload?.jobPostId;
                if (jobId) {
                    router.push(`/manage-job-post?openJob=${jobId}`);
                } else {
                    router.push(`/manage-job-post`);
                }
                break;
            case "feedback":
                router.push(`/feedback/${notification.additionalPayload?.jobId}`);
                break;
            case "job":
                router.push(`/job-post/${notification.additionalPayload?.jobId}`);
                break;
            default:
                console.log("Unknown notification type", notification);
        }
    };

    return (
        <div className="flex flex-col w-full h-full p-6 bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                    Thông báo của bạn
                </h1>
                {notifications.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                        {notifications.length}
                    </Badge>
                )}
            </div>

            <Separator className="mb-4" />

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {notifications.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Không có thông báo
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Bạn sẽ nhận được thông báo mới ở đây
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <Card 
                            key={notification.id}
                            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 group"
                        >
                            <CardContent className="p-4">
                                <div 
                                    className="flex items-start gap-4"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Avatar/Logo */}
                                    <div className="relative flex-shrink-0">
                                        <div className="relative">
                                            <Image
                                                src={logo}
                                                alt="Logo"
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-background"
                                                width={48}
                                                height={48}
                                            />
                                            {/* Notification type indicator */}
                                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm border">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                {notification.title}
                                            </h3>
                                            <Badge 
                                                variant={getNotificationBadgeVariant(notification.type)}
                                                className="flex-shrink-0"
                                            >
                                                {notification.type}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                            {notification.content}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{getTimeAgo(notification.timestamp.toString())}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Footer Action (if notifications exist) */}
            {notifications.length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="flex justify-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            Đánh dấu tất cả đã đọc
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationSection;