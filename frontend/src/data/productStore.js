import { mockProducts } from './mockData';

const STORAGE_KEY = 'bd_products';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  const initial = mockProducts.map(p => ({
    ...p,
    sku: `LAP-${p.brand.toUpperCase().slice(0, 3)}-${p.id}000`,
    modelNumber: p.name.split(' ').slice(-1)[0],
    shortDescription: `High-performance ${p.category.toLowerCase()} for business use.`,
    status: 'Active',
    featured: p.id <= 2,
    newArrival: p.id === 1,
    warrantyPeriod: '3 Years',
    supportType: 'Onsite',
    tags: [p.brand.toLowerCase(), p.category.toLowerCase()],
    createdAt: new Date().toISOString(),
  }));
  save(initial);
  return initial;
}

function save(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const productStore = {
  getAll() { return load(); },

  getById(id) { return load().find(p => p.id === Number(id)) || null; },

  add(product) {
    const list = load();
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    };
    save([...list, newProduct]);
    return newProduct;
  },

  update(id, updates) {
    const list = load().map(p =>
      p.id === Number(id) ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    save(list);
    return list.find(p => p.id === Number(id));
  },

  delete(id) {
    save(load().filter(p => p.id !== Number(id)));
  },
};
