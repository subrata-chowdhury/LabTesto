"use client";
import fetcher from "@/lib/fetcher";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const ItemCountContext = createContext<{ itemCount: number; setItemCount: React.Dispatch<React.SetStateAction<number>> }>({
    itemCount: 0,
    setItemCount: () => { },
});

export function ItemCountContextProvider({ children }: { children: ReactNode }) {
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        fetcher.get<{ items: number }>('/cart/count').then(res => {
            if (res.status === 200 && res.body) {
                setItemCount(res.body.items || 0)
            };
        })
    }, [])
    
    return (
        <ItemCountContext.Provider value={{ itemCount, setItemCount }}>
            {children}
        </ItemCountContext.Provider>
    );
}

export function useItemCountContext() {
    return useContext(ItemCountContext);
}
