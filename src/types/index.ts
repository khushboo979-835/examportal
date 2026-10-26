export type CategoryLevel = 'K12' | 'HIGHER_ED' | 'COMPETITIVE';
export type Medium = 'HINDI' | 'ENGLISH' | 'BILINGUAL';
export type MaterialType = 'NOTES' | 'PYQ' | 'MODEL_PAPER' | 'FORMULA_SHEET';
export type Role = 'USER' | 'ADMIN' | 'CREATOR';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  avatarUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  level: CategoryLevel;
  parentId?: string | null;
  children?: Category[];
  boardOrExams?: BoardOrExam[];
}

export interface BoardOrExam {
  id: string;
  name: string;
  code: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  categoryId: string;
  category?: Category;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  classLevel: string;
  boardOrExamId: string;
  boardOrExam?: BoardOrExam;
  products?: PDFProduct[];
}

export interface PDFProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  highlights: string[];
  tableOfContents: string[];
  price: number;
  discountedPrice?: number | null;
  fileKey: string;
  previewKey?: string | null;
  previewUrl?: string | null;
  pageCount: number;
  totalPages?: number;
  fileSize: number;
  fileSizeBytes?: number;
  fileFormat: string;
  medium: Medium;
  materialType: MaterialType;
  tags: string[];
  authorName?: string | null;
  creatorId?: string | null;
  subjectId: string;
  subject?: Subject & {
    boardOrExam?: BoardOrExam & {
      category?: Category;
    };
  };
  isPublished: boolean;
  isFeatured: boolean;
  isPassEligible?: boolean;
  accessType?: string;
  rating: number;
  reviewCount: number;
  totalDownloads: number;
  totalSales: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  pdfProductId: string;
  pdfProduct?: PDFProduct;
  price: number;
  createdAt: Date | string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  gatewayOrderId?: string | null;
  gatewayPaymentId?: string | null;
  gatewayTransactionId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderItems: OrderItem[];
}

export interface DownloadLog {
  id: string;
  userId: string;
  user?: User;
  pdfProductId: string;
  pdfProduct?: PDFProduct;
  ipAddress?: string | null;
  userAgent?: string | null;
  watermarkTag?: string | null;
  downloadedAt: Date | string;
}

export interface SearchFilters {
  query?: string;
  categoryLevel?: CategoryLevel;
  boardCode?: string;
  classLevel?: string;
  subjectSlug?: string;
  medium?: Medium;
  materialType?: MaterialType;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'latest' | 'price_low' | 'price_high' | 'rating';
  page?: number;
  limit?: number;
}
