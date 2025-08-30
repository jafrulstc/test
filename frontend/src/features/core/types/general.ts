// frontend/src/features/core/types/general.ts
import type { BaseEntity } from '~/shared/types/common';
import { Address } from '~/features/core/types/geography';

/** ============================
 * Entity interfaces (with BaseEntity)
 * ============================ */

/** Gender entity interface */
export interface Gender extends BaseEntity {
  name: string;
}

export interface MaritalStatus extends BaseEntity {
  name: string;
}

export interface DesignationCategory extends BaseEntity {
  name: string
}

/** Designation entity interface */
export interface Designation extends BaseEntity {
  name: string;
  designationCategoryId: string;
  designationCategory?: {
    name: string;
  };
}
export interface PersonCategory extends Gender {}

/** Blood Group entity interface */
export interface BloodGroup extends BaseEntity {
  name: string;
}

/** Residential Status entity interface */
export interface ResidentialStatus extends BaseEntity {
  name: string;
}

/** Religion entity interface */
export interface Religion extends BaseEntity {
  name: string;
}



/** Relation entity interface */
export interface Relation extends BaseEntity {
  name: string;
}

/** Marital Status entity interface */
export interface MaritalStatus extends BaseEntity {
  name: string;
}

/** Stuff entity interface */

export interface JobRule extends BaseEntity{
  name: string;
}

/** Guardian entity interface */
export interface Guardian extends BaseEntity {
  name: string;
  phone: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
  student_id: string;
  relation: string;
  student?: {
    first_name: string;
    last_name: string;
    photo?: string;
  };
}

/** ============================
 * Supporting Interfaces
 * ============================ */


/** Guardian with populated address details */
export interface GuardianDetail extends Guardian {
  presentAddressDetails?: Address;
  permanentAddressDetails?: Address;
}


export interface EducationalMentor extends Guardian {}

export interface EducationalMentorDetail extends GuardianDetail {}

/** General entity types */
export type GeneralEntityType =
  | 'gender'
  | 'bloodGroup'
  | 'residentialStatus'
  | 'religion'
  | 'designation'
  | 'designationCategory'
  | 'guardian'
  | 'educationalMentor'
  | 'relation'
  | 'maritalStatus'
  | 'jobRule'
  | 'personCategory';

/** General entity union type */
export type GeneralEntity =
  | Gender
  | BloodGroup
  | ResidentialStatus
  | Religion
  | Guardian
  | Designation
  | DesignationCategory
  | EducationalMentor
  | Relation
  | MaritalStatus
  | JobRule
  | PersonCategory;



/** ============================
 * DTOs — Create
 * ============================ */

export interface CreateGenderDto {
  name: string;
}

export interface CreateBloodGroupDto {
  name: string;
}

export interface CreateResidentialStatusDto {
  name: string;
}

export interface CreateReligionDto {
  name: string;
}

export interface CreateDesignationDto {
  name: string;
  designationCategoryId: string;
}

export interface CreateRelationDto {
  name: string;
}

export interface CreateMaritalStatusDto {
  name: string;
}

export interface CreateJobRuleDto {
  name: string;
}

export interface CreateDesignationCategoryDto {
  name: string;
}

export interface CreateEducationalMentorDto {
  name: string;
  phone: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  student_id: string;
  relation: string;
  student?: {
    first_name: string;
    last_name: string;
    photo?: string;
  };
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}

export interface CreatePersonCategoryDto {
  name: string;
}

export interface UpdatePersonCategoryDto {
  name?: string;
}

export interface CreateGuardianDto {
  name: string;
  phone: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  student_id: string;
  relation: string;
  student?: {
    first_name: string;
    last_name: string;
    photo?: string;
  };
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}

/** ============================
 * DTOs — Update
 * ============================ */

export interface UpdateGenderDto {
  name?: string;
}
export interface UpdateBloodGroupDto {
  name?: string;
}

export interface UpdateResidentialStatusDto {
  name?: string;
}

export interface UpdateReligionDto {
  name?: string;
}

export interface UpdateDesignationDto {
  name?: string;
  designationCategoryId?: string;
}

export interface UpdateRelationDto {
  name?: string;
}

export interface UpdateMaritalStatusDto {
  name?: string;
}

export interface UpdateJobRuleDto {
  name?: string;
}

export interface UpdateDesignationCategoryDto {
  name?: string;
}

export interface UpdateEducationalMentorDto {
  name?: string;
  phone?: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  student_id?: string;
  student?: {
    first_name: string;
    last_name: string;
    photo?: string;
  };
  relation?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}

export interface UpdateGuardianDto {
  name?: string;
  phone?: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  student_id?: string;
  student?: {
    first_name: string;
    last_name: string;
    photo?: string;
  };
  relation?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}


/** General filters interface */
export interface GeneralFilters {
  search?: string;
}