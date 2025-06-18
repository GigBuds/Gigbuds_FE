export interface Notification {
    id: number;
    content: string;
    timestamp: Date;
    isRead: boolean;
    additionalPayload?: Record<string, string>;
    type: string;
    title?: string;
}