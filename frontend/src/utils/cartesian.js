// utils/cartesian.js
export function generateVariantMatrix(variantOptions) {
  // variantOptions = { ram: ["8GB", "16GB"], storage: ["256GB", "512GB"] }
  const keys = Object.keys(variantOptions);
  if (keys.length === 0) return [];

  return keys.reduce((acc, key) => {
    const values = variantOptions[key];
    if (!acc.length) return values.map(val => ({ [key]: val }));

    return acc.flatMap(existing =>
      values.map(val => ({ ...existing, [key]: val }))
    );
  }, []);
}