export const BASE_PATH = '/4SeasonsShopping';
export const getAssetPath = (path) => {
  const p = path.startsWith('/') ? path.substring(1) : path;
  return `${BASE_PATH}/${p}`;
};
