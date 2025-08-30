import type { BaseEntity } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';

/**
 * Educational Qualification interface
 */
export interface EducationalQualification {
  id: string;
  degreeName: string;
  institution: string;
  year: string;
  grade: string;
  documentUrl?: string;
}

/**
 * Professional Experience interface
 */
export interface ProfessionalExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
  achievements?: string;
}

/**
 * Reference interface
 */
export interface Reference {
  id: string;
  name: string;
  relationship: string;
  contactNumber: string;
  email?: string;
  recommendationLetterUrl?: string;
}

/**
 * Skill interface
 */
export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

/**
 * Language interface
 */
export interface Language {
  languageId: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

/**
 * Teacher entity interface
 */
export interface Teacher extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;
  
  // Demographics
  genderId: string;
  bloodGroupId?: string;
  nationalityId?: string;
  maritalStatusId?: string;
  relationId?: string;
  
  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  
  // Educational Qualifications
  educationalQualifications: EducationalQualification[];
  
  // Professional Experience
  professionalExperience: ProfessionalExperience[];
  
  // References & Testimonials
  references: Reference[];
  
  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  designationIds?: string[]; // Add designationId here
  
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
  status: 'Active' | 'Inactive' | 'Pending';
}

/**
 * Age calculation helper (computed property)
 */
// export interface TeacherWithAge extends Teacher {
//   age: number;
// }

/**
 * Create Teacher DTO
 */
export interface CreateTeacherDto {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;
  
  // Demographics
  genderId: string;
  bloodGroupId?: string;
  nationalityId?: string;
  maritalStatusId?: string;
  relationId?: string;
  
  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  
  // Educational Qualifications
  educationalQualifications: Omit<EducationalQualification, 'id'>[];
  
  // Professional Experience
  professionalExperience: Omit<ProfessionalExperience, 'id'>[];
  
  // References & Testimonials
  references: Omit<Reference, 'id'>[];
  
  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  designationIds?: string[];  // Add designationId here
  
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
  status: 'Active' | 'Inactive' | 'Pending';
}

/**
 * Update Teacher DTO
 */
export interface UpdateTeacherDto {
  // Personal Information
  firstName?: string;
  lastName?: string;
  // age?: number;
  dateOfBirth?: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;
  
  // Demographics
  genderId?: string;
  bloodGroupId?: string;
  nationalityId?: string;
  maritalStatusId?: string;
  relationId?: string;
  
  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  
  // Educational Qualifications
  educationalQualifications?: EducationalQualification[];
  
  // Professional Experience
  professionalExperience?: ProfessionalExperience[];
  
  // References & Testimonials
  references?: Reference[];
  
  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  designationIds?: string[]; // Add designationId here
  
  // Teaching Specialization
  subjectIds?: string[];
  gradeLevelIds?: string[];
  languageProficiencyIds?: string[];
  
  // Skills & Competencies
  computerSkills?: string;
  teachingMethodology?: string;
  onlineProfiles?: {
    linkedin?: string;
    personalWebsite?: string;
  };
  
  // Additional Information
  details?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
}

/**
 * Teacher filters interface
 */
export interface TeacherFilters {
  search?: string;
  status?: string;
  genderId?: string;
  subjectId?: string;
  gradeLevelId?: string;
  designationIds?: string[]; // Add designationId here
}

/**
 * Teacher with populated details
 */
export interface TeacherDetail extends Teacher {
  gender?: { id: string; name: string };
  bloodGroup?: { id: string; name: string };
  nationality?: { id: string; name: string };
  maritalStatus?: { id: string; name: string };
  relation?: { id: string; name: string };
  subjects?: { id: string; name: string }[];
  gradeLevels?: { id: string; name: string }[];
  languageProficiencies?: { id: string; name: string }[];
  designations?: { id: string; name: string }[]; // Add designation here
}