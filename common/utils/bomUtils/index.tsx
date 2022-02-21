export default (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

export const isMobile = () => /mobile|phone|android|pad/i.test(window.navigator.userAgent);

export const isPad = () => /pad/i.test(window.navigator.userAgent);

export const isIos = () => /iphone|ipad/i.test(window.navigator.userAgent);

export const isAndroid = () => /android/i.test(window.navigator.userAgent);

export const refresh = () => {
  const {
    location: { origin, pathname, hash },
  } = window;
  window.location.href = origin + pathname + hash;
};
