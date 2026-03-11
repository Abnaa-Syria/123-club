export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CHILD: 'CHILD',
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  SCHOOL: 'SCHOOL',
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const CONTENT_TYPES = {
  VIDEO: 'VIDEO',
  BOOK_STORY: 'BOOK_STORY',
  SONG: 'SONG',
  GAME: 'GAME',
};

export const MEMBERSHIP_LEVELS = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
};

export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export const BANNER_TYPES = {
  HOME: 'HOME',
  PROMO: 'PROMO',
  SEASONAL: 'SEASONAL',
  CAMPAIGN: 'CAMPAIGN',
};

export const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  SUSPENDED: 'bg-yellow-100 text-yellow-800',
  DELETED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-orange-100 text-orange-800',
  BRONZE: 'bg-amber-100 text-amber-800',
  SILVER: 'bg-gray-100 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-800',
  PLATINUM: 'bg-purple-100 text-purple-800',
};

