import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '@dex-kit/store/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
