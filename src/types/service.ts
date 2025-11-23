export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
