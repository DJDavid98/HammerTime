import { createContext, useContext } from 'react';

export type TimestampContextValue = [number, (value: number) => void];

const TimestampContext = createContext<TimestampContextValue>([0, () => undefined]);

export const TimestampContextProvider = TimestampContext.Provider;
export const useTimestampContext = () => useContext(TimestampContext);
