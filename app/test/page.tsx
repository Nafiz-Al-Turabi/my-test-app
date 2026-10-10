"use client";

import { useEffect, useMemo, useState } from "react";

export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images?: string[];
}

interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortOption = "default" | "price-low" | "price-high" | "rating";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [count, setCount] = useState<number>(0);

  // Fetch 100 products from public API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          "https://dummyjson.com/products?limit=100",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsApiResponse = await response.json();
        setProducts(data.products);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Create category list only when products change
  const categories = useMemo<string[]>(() => {
    return ["all", ...new Set(products.map((product) => product.category))];
  }, [products]);

  // Search + category filter + sorting
  const filteredProducts = useMemo<Product[]>(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, search, category, sort]);

  if (loading) {
    return <div className="p-10 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 text-gray-900 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Product Explorer</h1>
          <p className="mt-2 text-gray-600">
            Explore, search, filter and sort products.
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="rounded-xl border bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border bg-white p-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border bg-white p-3"
          >
            <option value="default">Default order</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          <button
            onClick={() => setCount((c) => c + 1)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Unrelated counter: {count}
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="rounded-xl bg-white p-10 text-center">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-52 items-center justify-center bg-gray-50 p-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="space-y-3 p-4">
                  <p className="text-xs capitalize text-blue-600">
                    {product.category}
                  </p>

                  <h2 className="line-clamp-2 font-semibold">
                    {product.title}
                  </h2>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-amber-600">
                      ★ {product.rating}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
