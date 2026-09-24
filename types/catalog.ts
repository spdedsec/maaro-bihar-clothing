export type ProductCategory = "T-Shirts" | "Shirts" | "Denim" | "Ethnic" | "Everyday";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAt?: number;
  image: string;
  badge?: string;
  description: string;
  colors: string[];
  sizes: string[];
  unitLabel?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};
