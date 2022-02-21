import { v4 as uuid } from 'uuid';

export const downloadKeystore = (keystore: any) => {
  const aLink = document.createElement('a');
  const blob = new Blob([JSON.stringify(keystore)]);
  aLink.download = `${uuid}_keystore`;
  aLink.href = URL.createObjectURL(blob);
  document.body.appendChild(aLink);
  aLink.click();
  window.URL.revokeObjectURL(aLink.href);
  aLink.remove();
};

export const isUnlockWithWalletConnect = () => {
  const storage = sessionStorage.getItem('user') || '{}';
  const parsedStorage = JSON.parse(storage);
  return parsedStorage.flags && parsedStorage.flags.isWalletConnect;
};

const Account = () => {
  const storage = sessionStorage.getItem('user') || '{}';
  const parsedStorage = JSON.parse(storage);
  return !!parsedStorage.keystore;
};

export default Account;
