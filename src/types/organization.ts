export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  createdAt: Date;
}

export interface OrganizationWithDetails extends Organization {
  services: {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}
