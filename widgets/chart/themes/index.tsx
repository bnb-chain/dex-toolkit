import LightTheme from './light';
import DarkTheme from './dark';

const media = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;

export const getTVThemes = () => {
  return media && media.matches ? DarkTheme : LightTheme;
};
