import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT_INVENTORY } from './server/data/products.ts';
import { filterAndSortProducts } from './server/services/productService.ts';
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
  type SortOption,
} from './src/types/product.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_SORTS = new Set<SortOption>([
  'featured',
  'price_asc',
  'price_desc',
  'rating_desc',
]);

const ALLOWED_CATEGORIES = new Set<string>(PRODUCT_CATEGORIES);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', count: PRODUCT_INVENTORY.length });
  });

  app.get('/api/products', (req, res) => {
    const rawCategories =
      typeof req.query.categories === 'string' ? req.query.categories : '';
    const categories = rawCategories
      .split(',')
      .map((item) => item.trim())
      .filter((item): item is ProductCategory => ALLOWED_CATEGORIES.has(item));

    const parsedMin = Number(req.query.minPrice);
    const parsedMax = Number(req.query.maxPrice);
    const minPrice = Number.isFinite(parsedMin)
      ? Math.max(0, Math.min(100000, parsedMin))
      : 0;
    const maxPrice = Number.isFinite(parsedMax)
      ? Math.max(minPrice, Math.min(100000, parsedMax))
      : 100000;

    const parsedRating = Number(req.query.minRating);
    const minRating = Number.isFinite(parsedRating)
      ? Math.max(0, Math.min(5, parsedRating))
      : 0;

    const rawSort =
      typeof req.query.sort === 'string' ? req.query.sort : 'featured';
    const sortBy: SortOption = ALLOWED_SORTS.has(rawSort as SortOption)
      ? (rawSort as SortOption)
      : 'featured';

    const searchQuery =
      typeof req.query.q === 'string' ? req.query.q : '';

    const result = filterAndSortProducts(PRODUCT_INVENTORY, {
      categories,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      searchQuery,
    });

    res.json(result);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KARTLANE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
