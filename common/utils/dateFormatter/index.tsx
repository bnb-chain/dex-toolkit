import { pad } from '../number';

export const dateFormatter = (date: Date, showYear = true) => {
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  if (!showYear) return `${M}-${D} ${h}:${m}:${s}`;
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

export default dateFormatter;
