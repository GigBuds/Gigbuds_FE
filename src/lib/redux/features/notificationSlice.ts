import NotificationService from "@/service/notificationService/notificationService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks";
import { selectUser } from "./userSlice";
import { Notification } from "@/types/notification.types";
import { RootState } from "../store";

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (_, thunkAPI) => {
        try {
            const user = useAppSelector(selectUser);
            const storedNotifications = await NotificationService.getStoredNotifications();
            const missedNotifications = await NotificationService.getMissedNotifications(user?.id ?? 0);
            console.log(storedNotifications, missedNotifications);
            return [...storedNotifications, ...missedNotifications];
        } 
        catch (error) {
            console.error("Error fetching notifications", error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
}

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = [...state.notifications, ...action.payload];
        },
        markAsRead: (state, action: PayloadAction<string[]>) => {
            state.notifications = state.notifications.map(notification => {
                if (action.payload.includes(notification.id.toString())) {
                    return { ...notification, isRead: true };
                }
                return notification;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                const newNotifications = [...state.notifications, ...action.payload];
                newNotifications.sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                const uniqueNotifications = newNotifications.filter(
                    (currentElement, index, thisArr) =>
                        index === thisArr.findIndex((t) => t.id === currentElement.id)
                );

                state.notifications = uniqueNotifications;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Error fetching notifications";
            })
    }
})

export const { addNotification, markAsRead } = notificationSlice.actions;
export const selectNotifications = (store: RootState) => store.persistedReducer.notification;
export default notificationSlice.reducer;
