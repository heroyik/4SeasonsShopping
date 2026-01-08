export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const getAssetPath = (path) => {
  const p = path.startsWith('/') ? path.substring(1) : path;
  return `${BASE_PATH}/${p}`;
};
