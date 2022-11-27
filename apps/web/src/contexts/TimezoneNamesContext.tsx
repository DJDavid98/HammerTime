import { createContext, useContext } from 'react';

const TimezoneNamesContext = createContext<string[]>([]);

export const TimezoneNamesContextProvider = TimezoneNamesContext.Provider;
export const useTimezoneNamesContext = () => useContext(TimezoneNamesContext);
