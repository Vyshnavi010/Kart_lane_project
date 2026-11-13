import type {
  Product,
  ProductCategory,
  ProductFilterParams,
  ProductsApiResponse,
} from '../../src/types/product.ts';
import { PRODUCT_CATEGORIES } from '../../src/types/product.ts';

export function filterAndSortProducts(
  inventory: readonly Product[],
  params: ProductFilterParams,
): ProductsApiResponse {
  const normalizedQuery = params.searchQuery.trim().toLowerCase();

  // Step 1: Filter by search, price, and minimum rating first to compute dynamic category counts
  const baseMatched = inventory.filter((product) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.brand.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);

    const matchesPrice =
      product.price >= params.minPrice && product.price <= params.maxPrice;

    const matchesRating = product.rating >= params.minRating;

    return matchesSearch && matchesPrice && matchesRating;
  });

  const categoryCounts = PRODUCT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<ProductCategory, number>,
  );

  for (const item of baseMatched) {
    categoryCounts[item.category] += 1;
  }

  // Step 2: Apply multi-select category filter (OR logic across selected categories)
  const filtered =
    params.categories.length === 0
      ? baseMatched
      : baseMatched.filter((product) =>
          params.categories.includes(product.category),
        );

  // Step 3: Sort the filtered results based on the selected sort option
  const sorted = [...filtered].sort((a, b) => {
    switch (params.sortBy) {
      case 'price_asc':
        return a.price - b.price || a.featuredRank - b.featuredRank;
      case 'price_desc':
        return b.price - a.price || a.featuredRank - b.featuredRank;
      case 'rating_desc':
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case 'featured':
      default:
        return a.featuredRank - b.featuredRank;
    }
  });

  return {
    products: sorted,
    totalCount: inventory.length,
    filteredCount: sorted.length,
    categoryCounts,
  };
}
