import type { BaseEntity, Status } from '~/shared/types/common';

/**
 * Education Level entity interface
 */
export interface EducationLevel extends BaseEntity {
  name: string;
  description?: string;
  status: Status | 'Archived';
}

/**
 * Academic Year entity interface
 */
export interface AcademicYear extends BaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  status: Status | 'Archived';
}

/**
 * Academic Group entity interface
 */
export interface AcademicGroup extends BaseEntity {
  name: string;
  educationLevelIds: string[];
  status: Status | 'Archived';
  educationLevels?: EducationLevel[];
}

/**
 * Academic Class entity interface
 */
export interface AcademicClass extends BaseEntity {
  name: string;
  educationLevelId: string;
  academicGroupIds: string[];
  status: Status | 'Archived';
  educationLevel?: EducationLevel;
  academicGroups?: AcademicGroup[];
}

/**
 * Shift entity interface
 */
export interface Shift extends BaseEntity {
  name: string;
  status: Status 
}

/**
 * Section entity interface
 */
export interface Section extends BaseEntity {
  name: string;
  capacity?: number;
  status: Status 
}

/**
 * Shift Section Mapping interface
 */
export interface ShiftSectionMapping {
  shiftId: string;
  sectionIds: string[];
  shift?: Shift;
  sections?: Section[];
}

/**
 * Class Group Mapping entity interface
 */
export interface ClassGroupMapping extends BaseEntity {
  academicClassId: string;
  academicGroupId: string;
  academicYearId: string;
  shiftSectionMapping: ShiftSectionMapping[];
  academicClass?: AcademicClass;
  academicGroup?: AcademicGroup;
  academicYear?: AcademicYear;
}

/**
 * Subject entity interface
 */
export interface Subject extends BaseEntity {
  name: string;
  code?: string;
  description?: string;
  status: Status 
}

/**
 * Grade Level entity interface
 */
export interface GradeLevel extends BaseEntity {
  name: string;
  description?: string;
  status: Status 
}

/**
 * Language Proficiency entity interface
 */
export interface LanguageProficiency extends BaseEntity {
  name: string;
  status: Status 
}

/**
 * Create DTOs for each entity
 */
export interface CreateEducationLevelDto {
  name: string;
  description?: string;
  status: Status | 'Archived';
}

export interface CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  status: Status | 'Archived';
}

export interface CreateAcademicGroupDto {
  name: string;
  educationLevelIds: string[];
  status: Status | 'Archived';
}

export interface CreateAcademicClassDto {
  name: string;
  educationLevelId: string;
  academicGroupIds: string[];
  status: Status | 'Archived';
}

export interface CreateShiftDto {
  name: string;
  status: Status 
}

export interface CreateSectionDto {
  name: string;
  capacity?: number;
  status: Status 
}

export interface CreateClassGroupMappingDto {
  academicClassId: string;
  academicGroupId: string;
  academicYearId: string;
  shiftSectionMapping: ShiftSectionMapping[];
}

export interface CreateSubjectDto {
  name: string;
  code?: string;
  description?: string;
  status: Status 
}

export interface CreateGradeLevelDto {
  name: string;
  description?: string;
  status: Status 
}

export interface CreateLanguageProficiencyDto {
  name: string;
  status: Status 
}

/**
 * Update DTOs for each entity
 */
export interface UpdateEducationLevelDto {
  name?: string;
  description?: string;
  status?: Status | 'Archived';
}

export interface UpdateAcademicYearDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: Status | 'Archived';
}

export interface UpdateAcademicGroupDto {
  name?: string;
  educationLevelIds?: string[];
  status?: Status | 'Archived';
}

export interface UpdateAcademicClassDto {
  name?: string;
  educationLevelId?: string;
  academicGroupIds?: string[];
  status?: Status | 'Archived';
}

export interface UpdateShiftDto {
  name?: string;
  status?: Status 
}

export interface UpdateSectionDto {
  name?: string;
  capacity?: number;
  status?: Status 
}

export interface UpdateClassGroupMappingDto {
  academicClassId?: string;
  academicGroupId?: string;
  academicYearId?: string;
  shiftSectionMapping?: ShiftSectionMapping[];
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string;
  status?: Status 
}

export interface UpdateGradeLevelDto {
  name?: string;
  description?: string;
  status?: Status 
}

export interface UpdateLanguageProficiencyDto {
  name?: string;
  status?: Status 
}

/**
 * Academic filters interface
 */
export interface AcademicFilters {
  search?: string;
  status?: string;
  educationLevelId?: string;
  academicGroupId?: string;
  academicYearId?: string;
  academicClassId?: string;
}

/**
 * Academic entity types
 */
export type AcademicEntityType = 
  | 'educationLevel' 
  | 'academicYear' 
  | 'academicGroup' 
  | 'academicClass' 
  | 'shift' 
  | 'section' 
  | 'classGroupMapping'
  | 'subject'
  | 'gradeLevel'
  | 'languageProficiency';

/**
 * Academic entity union type
 */
export type AcademicEntity = 
  | EducationLevel 
  | AcademicYear 
  | AcademicGroup 
  | AcademicClass 
  | Shift 
  | Section 
  | ClassGroupMapping
  | Subject
  | GradeLevel
  | LanguageProficiency;

/**
 * Status options
 */
export const ACADEMIC_STATUS_OPTIONS = ['Active', 'Inactive', 'Archived'] as const;
export const SHIFT_STATUS_OPTIONS = ['Active', 'Inactive'] as const;