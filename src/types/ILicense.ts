import { License } from "@/generated/prisma";

export type ILicense = Omit<License, 'logo'> & {
  logo?: string | null;
}

export type IFormLicense = Omit<ILicense, 'id'|'logo'> & {
  id?: ILicense['id'] | null;
  logo?: ILicense['logo'] | File;
}

export type ILicenseFilter = {
  q?: string;
}

export type ILicenseSortableProperties = 'name' | 'hidden' | 'issueDate' | 'expirationDate';