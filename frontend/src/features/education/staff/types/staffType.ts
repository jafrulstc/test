// features/education/staff/types/staffType.ts

import type { BaseEntity, Status } from '~/shared/types/common';
import type { Person } from '~/features/education/person/types/personType';

/** ========== Atomic sub-types (unchanged) ========== */
export interface EducationalQualification {
  id: string;
  degreeName: string;
  institution: string;
  year: string;
  grade: string;
  documentUrl?: string;
}

export interface ProfessionalExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
  achievements?: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  contactNumber: string;
  email?: string;
  recommendationLetterUrl?: string;
}

/** ========== Staff (FK → Person) ========== */
export interface Staff extends BaseEntity {
  /** FK to Person.id (must be a "staff" person) */
  personStaffId: string;

  // Educational Qualifications
  educationalQualifications: EducationalQualification[];

  // Professional Experience
  professionalExperience?: ProfessionalExperience[];

  // References & Testimonials
  references?: Reference[];

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;            // ISO date
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;           // e.g., "1 month"

  // Teaching Specialization
  subjectIds: string[];
  gradeLevelIds: string[];
  languageProficiencyIds: string[];

  // Skills & Competencies
  computerSkills?: string;
  teachingMethodology?: string;
  onlineProfiles?: {
    linkedin?: string;
    personalWebsite?: string;
  };

  // Additional Information
  details?: string;

  /** Status = shared enum ('ACTIVE' | 'INACTIVE' | 'ARCHIVE') */
  status: Status;
}

type StaffCreateBase = Omit<
  Staff,
  'id' | 'createdAt' | 'updatedAt' |
  'educationalQualifications' | 'professionalExperience' | 'references'
>;

/** ========== Create DTO ========== */

export type CreateStaffDto = StaffCreateBase & {
  educationalQualifications: Omit<EducationalQualification, 'id'>[];
  professionalExperience?: Omit<ProfessionalExperience, 'id'>[];
  references?: Omit<Reference, 'id'>[];
};

// ---------- DTOs ----------



export type UpdateStaffDto = Partial<
  Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>
>;


export interface StaffFilters {
  search?: string;                 // নাম/ইমেইল (person join) বা subject টেক্সট
  status?: Status | string;

  /** Person-derived filters (JOIN via personStaffId) */
  genderId?: string;
  nationalityId?: string;
  maritalStatusId?: string;

  /** Teaching filters */
  subjectId?: string;              // single subject filter shortcut
  gradeLevelId?: string;           // single grade filter shortcut
  languageProficiencyId?: string;  // single language shortcut

  /** Designation-based filtering (via Person join) */
  designationIds?: string[];       // Person.designationIds ভিত্তিতে

  /** Advanced: multi-selects if দরকার হয় */
  subjectIds?: string[];
  gradeLevelIds?: string[];
  languageProficiencyIds?: string[];
}

/** ========== Populated view (for UI) ==========
 * Person + lookup নাম/relations ইনলাইন — পুরোপুরি optional।
 */
export interface StaffDetail extends Staff {
  /** Populated Person (minimal) */
  person?: Pick<
    Person,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'fatherName'
    | 'motherName'
    | 'dateOfBirth'
    | 'email'
    | 'phone'
    | 'emergencyCont'
    | 'genderId'
    | 'bloodGroupId'
    | 'nationalityId'
    | 'maritalStatusId'
    | 'presentAddress'
    | 'permanentAddress'
    | 'sameAsPresent'
    | 'photo'
    | 'digitalSignatureFile'
    | 'status'
  > | null;

  /** Lookup/populated names (joins করলে) */
  gender?: { id: string; name: string };
  bloodGroup?: { id: string; name: string };
  nationality?: { id: string; name: string };
  maritalStatus?: { id: string; name: string };

  subjects?: { id: string; name: string }[];
  gradeLevels?: { id: string; name: string }[];
  languageProficiencies?: { id: string; name: string }[];

  /** Designations (Person থেকে populated) */
  designations?: { id: string; name: string }[];

  /** (ঐচ্ছিক) যদি category-ও দেখাতে চাও */
  designationCategories?: { id: string; name: string }[];
}
