"use client";
import logo from "../../../public/Gigbuds Logo.png";
import Image from "next/image";
// Time utility function


const NotificationSection = () => {
    const noti = [
        {
            id: 1,
            title: 'Bạn có 1 người theo dõi mới!',
            userName: 'Nguyễn Minh Anh',
            content: 'vừa theo dõi bạn. Hãy cập nhật hồ sơ để tăng số lượng ứng tuyển!',
            timestamp: '2023-10-01T12:00:00Z',
        },
        {
            id: 2,
            title: 'Ứng viên mới cho vị trí Kỹ sư phần mềm',
            userName: 'Nguyễn Minh Anh',
            content: 'đã nộp đơn ứng tuyển cho vị trí Kỹ sư phần mềm. Hãy xem xét hồ sơ của họ!',
            timestamp: '2023-10-02T14:30:00Z',
        },
        {
            id: 3,
            title: 'Bạn có một tin nhắn mới',
            userName: 'Nguyễn Thị B',
            content: 'đã gửi cho bạn một tin nhắn. Hãy kiểm tra hộp thư của bạn để xem chi tiết.',
            timestamp: '2023-10-03T09:15:00Z',
        },
    ];

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
        <div>
            <div className="flex flex-col w-full overflow-y-auto h-[95vh]">
                {noti.map((notification) => (
                    <div
                        key={notification.id}
                        className="shadow-md px-4 py-2 flex flex-row items-center gap-4"
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
                                    <span className="font-bold text-[#FF7345]">{notification.userName}</span> {notification.content}
                                </p>
                            </div>

                            <p className="text-[80%] text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSection;