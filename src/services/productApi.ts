import type { ProductFilterParams, ProductsApiResponse } from '../types/product.ts';

export async function fetchFilteredProducts(
  params: ProductFilterParams,
  signal?: AbortSignal,
): Promise<ProductsApiResponse> {
  const search = new URLSearchParams();
  if (params.categories.length > 0) {
    search.set('categories', params.categories.join(','));
  }
  search.set('minPrice', String(params.minPrice));
  search.set('maxPrice', String(params.maxPrice));
  search.set('minRating', String(params.minRating));
  search.set('sort', params.sortBy);
  if (params.searchQuery.trim().length > 0) {
    search.set('q', params.searchQuery.trim());
  }

  const response = await fetch(`/api/products?${search.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }

  return (await response.json()) as ProductsApiResponse;
}
