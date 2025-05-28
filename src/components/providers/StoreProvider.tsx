"use client"
import { PropsWithChildren, ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/lib/redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
export default function StoreProvider({
    children,
}: PropsWithChildren<{
    children: ReactNode
}>) {
    const storeRef = useRef<AppStore | null>(null)
    storeRef.current ??= makeStore();

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistStore(storeRef.current)}>
                {children}
            </PersistGate>
        </Provider>
    )
}
