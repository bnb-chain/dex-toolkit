import { useLocation } from 'react-router-dom';

export const TOKEN_TYPE_BEP2 = 'bep2';
export const TOKEN_TYPE_BEP8 = 'bep8';

export const TOKEN_TYPES = [TOKEN_TYPE_BEP2, TOKEN_TYPE_BEP8];

export const useCurrentTokenType = () => {
  const { pathname } = useLocation();
  return /\/mini\/?/.test(pathname) ? TOKEN_TYPE_BEP8 : TOKEN_TYPE_BEP2;
};

// used in class component
export const getTokenType = () => {
  return /\/mini\/?/.test(window.location.pathname) ? TOKEN_TYPE_BEP8 : TOKEN_TYPE_BEP2;
};
