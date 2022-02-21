import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@dex-kit/store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
