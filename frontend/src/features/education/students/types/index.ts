// student.types.ts

import type { BaseEntity, Status } from '~/shared/types/common';
import type {
  Person,
  PersonDetails,
  CreatePersonDTO,
  UpdatePersonDTO,
  PersonFilter,
} from '~/features/education/person/types/personType';

/**
 * Educational File interface for file uploads
 */
export interface EducationalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
}

/**
 * Previous School Details interface
 */
export interface PreviousSchoolDetails {
  schoolName: string;
  className: string;
  result: number;
  tcNumber: string;
  tcFileUrl?: string;
  tcFileName?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  details?: string;
}

/**
 * 🚨 New minimal Student entity
 * Now Student just links to a Person.
 */
export interface Student extends BaseEntity {
  /** FK to Person.id who is a "student" */
  personStudentId: string;

  /** Student lifecycle/status independent of Person.status */
  status: Status;
}

/**
 * Populated Student with person info and other projections for UI
 */
export interface StudentDetail extends Student {
  /** Populated person (full) */
  person?: PersonDetails | null;

  /** Convenience projections (for legacy UI bindings) */
  display?: {
    firstName?: string;
    lastName?: string;
    photo?: string;
    email?: string;
    genderName?: string;
    bloodGroupName?: string;
    religionName?: string;
    nationalityName?: string;
  };

  /** Back-ref admissions list (optional) */
  admissions?: Admission[];
}

/**
 * Admission entity interface
 */
export interface Admission extends BaseEntity {
  // Admission Details
  admissionNumber: number;
  admissionDate: string;
  registrationNumber?: string;
  classRole: number;
  educationalMentorId?: string;

  // Guardian/Teacher
  guardianId?: string;
  teacherId?: string;

  // Student link
  studentId: string;

  // Academic
  academicYearId: string;
  academicClassId: string;
  academicGroupId?: string;
  shiftId?: string;
  sectionId?: string;
  rollNumber: number;
  admissionFee: number;

  // Previous School Details (optional)
  previousSchoolDetails?: PreviousSchoolDetails[];

  // Status
  status: Status;

  // Populated fields (updated to map from Person)
  student?: {
    id: string;                 // Student.id
    personId: string;           // Person.id
    firstName?: string;
    lastName?: string;
    photo?: string;
  } | null;

  guardian?: { id: string; name: string };
  teacher?: { id: string; firstName: string; lastName: string };
  academicYear?: { id: string; name: string };
  academicClass?: { id: string; name: string };
  academicGroup?: { id: string; name: string };
  educationalMentor?: { id: string; name: string };
}

/**
 * ✅ Create Student DTO
 * Two ways:
 * 1) Link existing Person -> provide personStudentId
 * 2) Create Person inline -> provide person
 */
export type CreateStudentDto =
  | {
      /** Link existing Person */
      personStudentId: string;
      status: Status;
    }
  | {
      /** Create new Person inline, must be student category */
      person: CreatePersonDTO;
      status: Status;
    };

/**
 * ✅ Update Student DTO
 * - You can relink to another Person (rare).
 * - Or update embedded Person by payload (optional).
 * - Or just update Student.status.
 */
export interface UpdateStudentDto {
  personStudentId?: string;
  /** Patch Person fields (only used if backend supports cascading update) */
  personPatch?: UpdatePersonDTO;
  status?: Status;
}

/**
 * 🔎 Student filters
 * Prefer nested person filters. Legacy shorthand kept deprecated.
 */
export interface StudentFilters {
  /** Nested person filters (recommended) */
  person?: PersonFilter;

  /** Student-only filters */
  status?: string;

  /** @deprecated Use person.search or other person.* filters */
  search?: string;

  /** @deprecated Use person.genderId */
  genderId?: string;

  /** @deprecated Use person.bloodGroupId */
  bloodGroupId?: string;

  /** @deprecated Use person.religionId */
  religionId?: string;

  /** @deprecated Use person.nationalityId */
  nationalityId?: string;
}

/**
 * Admission filters (unchanged)
 */
export interface AdmissionFilters {
  search?: string;
  status?: string;
  academicYearId?: string;
  academicClassId?: string;
  academicGroupId?: string;
  admissionDateFrom?: string;
  admissionDateTo?: string;
}

/* ------------------------------------------------------------
   🧰 Legacy compatibility helpers (type-level)
   ------------------------------------------------------------ */

/**
 * A flat "legacy" snapshot shape some UIs relied on.
 * You can use this as a view model returned by APIs/services
 * that join Student + Person.
 */
export type StudentLegacyFlat = BaseEntity &
  Pick<
    Person,
    | 'firstName'
    | 'lastName'
    | 'fatherName'
    | 'motherName'
    | 'dateOfBirth'
    | 'email'
    | 'healthCondition'
    | 'nidNumber'
    | 'brnNumber'
    | 'genderId'
    | 'bloodGroupId'
    | 'religionId'
    | 'nationalityId'
    | 'presentAddress'
    | 'permanentAddress'
    | 'sameAsPresent'
    | 'photo'
    | 'nidFile'
    | 'brnFile'
    | 'fatherNidFile'
    | 'motherNidFile'
    | 'digitalSignatureFile'
  > & {
    personStudentId: string;
    status: Status;

    // Optional file names / lookup names carried from Person.necessary
    studentNidFileName?: string;
    studentBrnFileName?: string;
    fatherNidFileName?: string;
    motherNidFileName?: string;
    digitalSignatureFileName?: string;
    genderName?: string;
    bloodGroupName?: string;
    religionName?: string;
    nationalityName?: string;
  };

/**
 * Utility type for places that previously expected Student + Person merged
 */
export type StudentResolved = Student & { person: PersonDetails };
