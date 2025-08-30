import type { BaseEntity } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';
import type { Status } from '~/shared/types/common';


export interface Person extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string; // Birth Registration Number
  fatherNidNumber?: string;
  motherBrnNumber?: string; // Birth Registration Number

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;

  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;

  // File Uploads
  photo?: string;
  nidFile?: string;
  brnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;

  // File names & lookup names (for display only)
  necessary?: {
    genderName?: string;
    bloodGroupName?: string;
    religionName?: string;
    nationalityName?: string;

    nidFileName?: string;
    brnFileName?: string;
    fatherNidFileName?: string;
    motherNidFileName?: string;
    digitalSignatureFileName?: string;
  };

  status: Status;
}

export interface PersonDetails extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string;
  fatherNidNumber?: string;
  motherBrnNumber?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
  
  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;

  // File Uploads
  photo?: string;
  nidFile?: string;
  brnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;

  // Lookup Names (Required in Details)
  genderName: string;
  bloodGroupName?: string;
  religionName?: string;
  nationalityName?: string;
  
  // File Names
  nidFileName?: string;
  brnFileName?: string;
  fatherNidFileName?: string;
  motherNidFileName?: string;
  digitalSignatureFileName?: string;

  status: Status;
}


export interface CreatePersonDTO {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string;
  fatherNidNumber?: string;
  motherBrnNumber?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;

  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;

  // File Uploads (Base64 or URL paths)
  photo?: string;
  nidFile?: string;
  brnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;
}

export interface UpdatePersonDTO extends Partial<CreatePersonDTO> {
  id: string;
  status?: Status; // শুধুমাত্র আপডেটের জন্য
}


export interface PersonFilter {
  // Personal Information Filters
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  email?: string;
  nidNumber?: string;
  brnNumber?: string;

  // Demographic Filters
  genderId?: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;

  // Status Filter
  status?: Status;

  // Address Filters
  presentAddress?: Partial<Address>;
  permanentAddress?: Partial<Address>;

  // Pagination
  page?: number;
  limit?: number;

  // Sorting
  sortBy?: keyof Person;
  sortOrder?: 'ASC' | 'DESC';
}