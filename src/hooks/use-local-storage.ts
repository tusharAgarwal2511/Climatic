import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T){
    const [storedvalue, setStoredValue] = useState<T>(() =>{
        try{
            const item = window.localStorage.getItem(key);
            return item?JSON.parse(item) : initialValue;
        }
        catch(error){
            return initialValue;
        }
    })

    useEffect(() =>{
        try {
            window.localStorage.setItem(key, JSON.stringify(storedvalue));
        } 
        catch (error) {
            console.log(error);
            
        }
    }, [key, storedvalue])
    return [storedvalue, setStoredValue] as const;
}