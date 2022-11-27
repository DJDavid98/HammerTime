import { createContext, useContext } from 'react';

export type TimezoneContextValue = [string, (value: string) => void];

const TimezoneContext = createContext<TimezoneContextValue>(['', () => undefined]);

export const TimezoneContextProvider = TimezoneContext.Provider;
export const useTimezoneContext = () => useContext(TimezoneContext);
