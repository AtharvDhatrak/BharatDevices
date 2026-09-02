import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'laptops',
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=laptops'
  },
  {
    id: 'desktops',
    name: 'Desktops',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=desktops'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=monitors'
  },
  {
    id: 'networking',
    name: 'Networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=networking'
  },
  {
    id: 'printers',
    name: 'Printers',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=printers'
  },
  {
    id: 'storage',
    name: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=storage'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=accessories'
  },
  {
    id: 'cctv',
    name: 'CCTV',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80',
    link: '/products?category=cctv'
  }
];

export default function ShopByCategory() {
  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Shop by Category
          </h2>
          <Link 
            to="/categories" 
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors"
          >
            View All Categories
            <span className="text-lg leading-none">&rarr;</span>
          </Link>
        </div>

        {/* Categories Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group flex flex-col items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 text-center"
            >
              {/* Product Image Frame */}
              <div className="w-full h-24 flex items-center justify-center mb-3 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-20 max-w-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                  loading="lazy"
                />
              </div>

              {/* Category Label */}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}