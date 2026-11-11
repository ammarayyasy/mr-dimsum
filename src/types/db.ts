export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[] | string;
  is_system: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  dish_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string;
  user_name: string;
  user_email: string;
  whatsapp: string;
  order_type: "dine_in" | "takeaway" | "delivery";
  address?: string;
  table_number?: string;
  items: OrderItem[] | string;
  total_price: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  notes?: string;
  cancel_reason?: string;
  payment_method: "QRIS";
  created_at: string;
  updated_at: string;
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  name: string;
  roleName: string;
  roleId: string;
  iat?: number;
  exp?: number;
}
