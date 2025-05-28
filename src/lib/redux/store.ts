import { configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import rootReducer from "./rootReducer"
import createWebStorage from "redux-persist/es/storage/createWebStorage"
import employerShiftCalendarReducer from "./features/employerShiftCalendarSlice";

const createNoopStorage = () => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        removeItem(_key: string) {
            return Promise.resolve();
        },
    }
}

const rootStorage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
    key: "root",
    storage: rootStorage, // use local storage as the storage engine
    timeout: 500
  };
  
  // Wrap the root reducer with the persist reducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  
export const makeStore = () => {
    return configureStore({
        reducer: {
            persistedReducer,
            employerShiftCalendar: employerShiftCalendarReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

