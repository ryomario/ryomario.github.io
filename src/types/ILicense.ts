import { License } from "@/generated/prisma";

export type ILicense = Omit<License, 'logo'> & {
  logo?: string | File | null;
}

export type ILicenseFilter = {
  q?: string;
}

export type ILicenseSortableProperties = 'name' | 'hidden' | 'issueDate' | 'expirationDate';