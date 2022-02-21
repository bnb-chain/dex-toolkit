type Favorites = {
  favorites_logined: Array<string>;
  favorites_unLogined: Array<string>;
};

export const getAddress = () => {
  const user = window.sessionStorage.getItem('user');
  const parsed = (user && JSON.parse(user)) || {};
  return parsed.address;
};

export const getFavorites = () => {
  let favorites = window.localStorage.getItem('favorites');
  return (
    (favorites && JSON.parse(favorites)) || {
      favorites_logined: [],
      favorites_unLogined: [],
    }
  );
};

export const getInitialFavorites = () => {
  const address = getAddress();
  const favorites: Favorites = getFavorites();
  if (!favorites) return;

  let result = favorites.favorites_unLogined;
  if (address) {
    const target = favorites.favorites_logined?.find((f) => f[address]?.length > 0);
    return target ? target[address] : [];
  }
  return result;
};
