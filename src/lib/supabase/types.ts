export type ContactStatus = "new" | "read" | "replied";

export type AuthUser = {
  id: string;
  email: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicMenuItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number;
};

export type PublicMenuCategory = {
  category: string;
  items: PublicMenuItem[];
};

export type DashboardStats = {
  menuItems: number;
  availableMenuItems: number;
  contactMessages: number;
  newContactMessages: number;
};
