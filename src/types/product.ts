export type ProductCategory =
  | 'Electronics'
  | 'Apparel'
  | 'Footwear'
  | 'Home & Kitchen'
  | 'Accessories';

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  'Electronics',
  'Apparel',
  'Footwear',
  'Home & Kitchen',
  'Accessories',
] as const;

export type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating_desc';

export type ImageKey =
  | 'elec_anc_headphones'
  | 'elec_ultrabook_laptop'
  | 'elec_mirrorless_camera'
  | 'apparel_merino_knit'
  | 'apparel_linen_overshirt'
  | 'apparel_tech_jacket'
  | 'foot_leather_sneaker'
  | 'foot_trail_runner'
  | 'foot_chelsea_boot'
  | 'home_espresso_machine'
  | 'home_pourover_kettle'
  | 'home_dutch_oven'
  | 'acc_chrono_watch'
  | 'acc_leather_backpack'
  | 'acc_acetate_sunglasses';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviewCount: number;
  imageKey: ImageKey;
  featuredRank: number;
  description: string;
  highlights: string[];
}

export interface ProductFilterParams {
  categories: ProductCategory[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: SortOption;
  searchQuery: string;
}

export interface ProductsApiResponse {
  products: Product[];
  totalCount: number;
  filteredCount: number;
  categoryCounts: Record<ProductCategory, number>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
