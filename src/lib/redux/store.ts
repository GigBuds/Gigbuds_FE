import { configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import localReducer from "./localReducer"
import tempReducer from "./tempReducer";
import localStorage from "redux-persist/lib/storage";

const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null); },
  setItem(_key: string, value: string) { return Promise.resolve(value); },
  removeItem() { return Promise.resolve(); },
});

const storage =
  typeof window !== 'undefined'
    ? localStorage
    : createNoopStorage();
const persistConfig = {
    key: "root",
    storage: storage, // use local storage as the storage engine
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

