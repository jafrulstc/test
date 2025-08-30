// person.types.ts

import type { BaseEntity } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';
import type { Status } from '~/shared/types/common';


/** Keep your original Person, just ensure optional display pack is stable */
export interface Person extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName?: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string;
  fatherNidNumber?: string;
  motherBrnNumber?: string;
  phone: number | null;
  emergencyCont: number | null;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
  maritalStatusId?: string;

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

  /** Category must indicate the person is a student/staff/guardian/mentor */
  personCategoryId: string;
  designationCategoryId?: string; // only if staff
  designationId?: string;

  /** Person's own status (not the same as Student.status) */
  status: Status;
}

export interface PersonDetails extends Person {}

export interface CreatePersonDTO
  extends Omit<Person, keyof BaseEntity | 'necessary'> {}

export interface UpdatePersonDTO extends Partial<CreatePersonDTO> {}

export interface PersonFilter
  extends Omit<Partial<Person>, keyof BaseEntity | 'necessary'> {
  // Address Filters
  presentAddress?: Partial<Address>;
  permanentAddress?: Partial<Address>;

  // Pagination
  page?: number;
  limit?: number;

  // Search & Sorting
  search?: string;
  sortBy?: keyof Person;
  sortOrder?: 'ASC' | 'DESC';
}
