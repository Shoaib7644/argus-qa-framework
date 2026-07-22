import { test, expect } from '@playwright/test';
import { ProductsResponseSchema } from '../../src/api/schemas/product.schema';

test.describe('Product API Contract', () => {
  test('GET /api/productsList returns valid response structure', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    // Validate against Zod schema
    const parseResult = ProductsResponseSchema.safeParse(responseBody);
    expect(parseResult.success).toBeTruthy();

    if (parseResult.success) {
      const data = parseResult.data;
      expect(data.responseCode).toBe(200);
      expect(Array.isArray(data.products)).toBeTruthy();
      expect(data.products.length).toBeGreaterThan(0);

      // Check first product structure
      const firstProduct = data.products[0];
      if (firstProduct) {
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('price');
        expect(firstProduct).toHaveProperty('brand');
        expect(firstProduct).toHaveProperty('category');
        expect(firstProduct.category).toHaveProperty('usertype');
        expect(firstProduct.category.usertype).toHaveProperty('usertype');
        expect(firstProduct.category).toHaveProperty('category');
      }
    }
  });
});

// Empty line for Prettier
