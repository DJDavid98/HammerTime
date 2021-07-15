import { TFunction } from 'react-i18next';

export type Nullable<T> = T | null;

type TFuncParams = Parameters<TFunction>;
export type Translatable = [TFuncParams[0]] | [TFuncParams[0], Exclude<TFuncParams[2], string | undefined>];
