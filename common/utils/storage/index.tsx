export const saveAddress = (newAddress, configObj) => {
  let user = window.sessionStorage.getItem('user');
  user = (user && JSON.parse(user)) || {};
  user = {
    address: newAddress,
    ...configObj,
  };
  window.sessionStorage.setItem('user', JSON.stringify(user));
};

export const saveFingerPrint = (data) => {
  window.localStorage.setItem('__DI__', JSON.stringify(data));
};
