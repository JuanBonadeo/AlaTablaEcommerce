// =========================
// ENUMS
// =========================
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum PaymentProvider {
  MERCADOPAGO = 'MERCADOPAGO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED'
}

// =========================
// INTERFACES BASE
// =========================
export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  phone?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface ProductVariant {
  id: string;
  slug: string;
  name: string;
  price?: number;
  stock?: number;
  productId: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  images: ProductImage[];
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId?: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  transactionId?: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier?: string;
  tracking?: string;
  status: ShipmentStatus;
  shippedAt?: Date;
  deliveredAt?: Date;
}

// =========================
// INTERFACES CON RELACIONES
// =========================
export interface UserWithRelations extends User {
  accounts?: Account[];
  sessions?: Session[];
  addresses?: Address[];
  orders?: OrderWithRelations[];
  cart?: CartWithRelations;
}

export interface ProductWithRelations extends Product {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartWithRelations extends Cart {
  user: User;
  items: CartItemWithRelations[];
}

export interface CartItemWithRelations extends CartItem {
  product: ProductWithRelations;
  variant?: ProductVariant;
}

export interface OrderWithRelations extends Order {
  user: User;
  address?: Address;
  items: OrderItemWithRelations[];
  payment?: Payment;
  shipment?: Shipment;
}

export interface OrderItemWithRelations extends OrderItem {
  product: ProductWithRelations;
  variant?: ProductVariant;
}

// =========================
// INTERFACES PARA FORMULARIOS
// =========================
export interface CreateUserForm {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateAddressForm {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface CreateProductForm {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  variants?: {
    name: string;
    slug: string;
    price?: number;
    stock?: number;
  }[];
}

export interface UpdateProductForm extends Partial<CreateProductForm> {
  id: string;
}

export interface AddToCartForm {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemForm {
  quantity: number;
}

export interface CreateOrderForm {
  addressId?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

export interface ProcessPaymentForm {
  orderId: string;
  provider: PaymentProvider;
  transactionId?: string;
  notes?: string;
}

// =========================
// INTERFACES PARA API RESPONSES
// =========================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse extends PaginatedResponse<ProductWithRelations> {}
export interface OrdersResponse extends PaginatedResponse<OrderWithRelations> {}
export interface UsersResponse extends PaginatedResponse<UserWithRelations> {}

// =========================
// INTERFACES PARA FILTROS Y BÚSQUEDA
// =========================
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =========================
// INTERFACES PARA DASHBOARD/ADMIN
// =========================
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

// =========================
// INTERFACES PARA CONTEXTOS (React)
// =========================
export interface AuthContextType {
  user: UserWithRelations | null;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: CreateUserForm) => Promise<void>;
}

export interface CartContextType {
  cart: CartWithRelations | null;
  isLoading: boolean;
  addItem: (item: AddToCartForm) => Promise<void>;
  updateItem: (itemId: string, data: UpdateCartItemForm) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

// =========================
// TIPOS UTILITARIOS
// =========================
export type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProduct = Partial<CreateProduct> & { id: string };

export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateOrder = Partial<Order>;

export type CartItemWithTotal = CartItemWithRelations & {
  subtotal: number;
};

export type OrderSummary = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemsCount: number;
};