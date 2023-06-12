import { ChangeEventHandler, createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface LocalSettingsContextValue {
  customInputEnabled: boolean;
  combinedInputsEnabled: boolean;
  toggleCustomInput: ChangeEventHandler<HTMLInputElement>;
  toggleSeparateInputs: ChangeEventHandler<HTMLInputElement>;
}

const defaultFunction = () => undefined;

const LocalSettingsContext = createContext<LocalSettingsContextValue>({
  customInputEnabled: false,
  combinedInputsEnabled: false,
  toggleCustomInput: defaultFunction,
  toggleSeparateInputs: defaultFunction,
});

export const useLocalSettings = () => useContext(LocalSettingsContext);

const splitPrefKey = 'split-input';
const customPrefKey = 'custom-input';

export const LocalSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [combinedInput, setCombinedInput] = useState(false);
  const [customInput, setCustomInput] = useState(false);
  const toggleSeparateInputs: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCombinedInput(!e.target.checked);
  }, []);
  const toggleCustomInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCustomInput(e.target.checked);
  }, []);
  useEffect(() => {
    localStorage.setItem(splitPrefKey, combinedInput ? 'false' : 'true');
  }, [combinedInput]);
  useEffect(() => {
    localStorage.setItem(customPrefKey, customInput ? 'true' : 'false');
  }, [customInput]);

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

  const ctxValue: LocalSettingsContextValue = useMemo(
    () => ({
      toggleSeparateInputs,
      toggleCustomInput,
      combinedInputsEnabled: combinedInput,
      customInputEnabled: customInput,
    }),
    [combinedInput, customInput, toggleCustomInput, toggleSeparateInputs],
  );

  return <LocalSettingsContext.Provider value={ctxValue}>{children}</LocalSettingsContext.Provider>;
};
