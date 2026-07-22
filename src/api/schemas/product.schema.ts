import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  brand: z.string(),
  category: z.object({
    usertype: z.object({
      usertype: z.string(),
    }),
    category: z.string(),
  }),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductsResponseSchema = z.object({
  responseCode: z.number(),
  products: z.array(ProductSchema),
});

export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
