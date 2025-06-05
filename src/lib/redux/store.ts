import { configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import localReducer from "./localReducer"
import createWebStorage from "redux-persist/es/storage/createWebStorage"
import tempReducer from "./tempReducer";

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

// luu torng local storage
// luu cho kahc -
const persistConfig = {
    key: "root",
    storage: rootStorage, // use local storage as the storage engine
    timeout: 500
  };
  
  // Wrap the root reducer with the persist reducer
  const persistedReducer = persistReducer(persistConfig, localReducer);
  
  
export const makeStore = () => {
    return configureStore({
        reducer: {
            persistedReducer, // Luu trong local storage
            tempReducer, // Luu tam thoi
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

