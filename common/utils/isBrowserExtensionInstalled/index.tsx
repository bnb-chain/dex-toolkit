const isBrowserExtensionInstalled = () => {
  if (typeof window !== 'undefined') {
    return !!window.BinanceChain;
  }
  return true;
};

export default isBrowserExtensionInstalled;
