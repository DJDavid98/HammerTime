import { ChangeEventHandler, createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface LocalSettingsContextValue {
  customInputEnabled: boolean | null;
  combinedInputsEnabled: boolean | null;
  sidebarOnRight: boolean | null;
  toggleCustomInput: ChangeEventHandler<HTMLInputElement>;
  toggleSeparateInputs: ChangeEventHandler<HTMLInputElement>;
  toggleSidebarOnRight: VoidFunction;
}

const defaultFunction = () => undefined;

const LocalSettingsContext = createContext<LocalSettingsContextValue>({
  customInputEnabled: false,
  combinedInputsEnabled: false,
  sidebarOnRight: false,
  toggleCustomInput: defaultFunction,
  toggleSeparateInputs: defaultFunction,
  toggleSidebarOnRight: defaultFunction,
});

export const useLocalSettings = () => useContext(LocalSettingsContext);

const splitPrefKey = 'split-input';
const customPrefKey = 'custom-input';
const sidebarPrefKey = 'sidebar-right';

export const LocalSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [combinedInput, setCombinedInput] = useState<boolean | null>(null);
  const [customInput, setCustomInput] = useState<boolean | null>(null);
  const [sidebarOnRight, setSidebarOnRight] = useState<boolean | null>(null);
  const toggleSeparateInputs: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCombinedInput(!e.target.checked);
  }, []);
  const toggleCustomInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCustomInput(e.target.checked);
  }, []);
  useEffect(() => {
    if (combinedInput === null) return;
    localStorage.setItem(splitPrefKey, combinedInput ? 'false' : 'true');
  }, [combinedInput]);
  useEffect(() => {
    if (customInput === null) return;
    localStorage.setItem(customPrefKey, customInput ? 'true' : 'false');
  }, [customInput]);
  useEffect(() => {
    if (sidebarOnRight === null) return;
    localStorage.setItem(sidebarPrefKey, sidebarOnRight ? 'true' : 'false');
  }, [sidebarOnRight]);

  useEffect(() => {
    const storedPref = localStorage.getItem(splitPrefKey);
    if (storedPref !== null) {
      setCombinedInput(storedPref !== 'true');
      return;
    }

    // Feature detection for datetime-local input
    const testInput = document.createElement('input');
    testInput.setAttribute('type', 'datetime-local');
    const testValue = '1)';
    testInput.value = testValue;
    setCombinedInput(testInput.value !== testValue);
  }, []);
  useEffect(() => {
    const storedPref = localStorage.getItem(customPrefKey);
    // Enable custom input by default
    setCustomInput(storedPref !== 'false');
  }, []);
  useEffect(() => {
    const storedPref = localStorage.getItem(sidebarPrefKey);
    // Sidebar is on the left by default
    setSidebarOnRight(storedPref === 'true');
  }, []);

  const ctxValue: LocalSettingsContextValue = useMemo(
    () => ({
      toggleSeparateInputs,
      toggleCustomInput,
      toggleSidebarOnRight: () => setSidebarOnRight((v) => !v),
      combinedInputsEnabled: combinedInput,
      customInputEnabled: customInput,
      sidebarOnRight,
    }),
    [combinedInput, customInput, sidebarOnRight, toggleCustomInput, toggleSeparateInputs],
  );

  return <LocalSettingsContext.Provider value={ctxValue}>{children}</LocalSettingsContext.Provider>;
};
