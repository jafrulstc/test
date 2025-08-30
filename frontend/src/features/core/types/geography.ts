import { GeographyEntityType } from '~/app/constants';
import type { BaseEntity } from '~/shared/types/common';

/** ============================
 * Address and Entity Interfaces
 * ============================ */

/** Address interface for both present and permanent addresses */
export interface Address {
  nationalityId?: string;
  divisionId?: string;
  districtId?: string;
  subDistrictId?: string;
  postOfficeId?: string;
  villageId?: string;
}

/** Nationality entity interface */
export interface Nationality extends BaseEntity {
  name: string;
}

/** Division entity interface */
export interface Division extends BaseEntity {
  name: string;
  nationalityId: string;
  nationality?: Nationality;
}

/** District entity interface */
export interface District extends BaseEntity {
  name: string;
  divisionId: string;
  division?: Division;
}

/** Sub District entity interface */
export interface Sub_District extends BaseEntity {
  name: string;
  districtId: string;
  district?: District;
}

/** Post Office entity interface */
export interface Post_Office extends BaseEntity {
  name: string;
  subDistrictId: string;
  subDistrict?: Sub_District;
}

/** Village entity interface */
export interface Village extends BaseEntity {
  name: string;
  postOfficeId: string;
  postOffice?: Post_Office;
}

/** ============================
 * Type and Union Definitions
 * ============================ */

export type GeographyEntity =
  | Nationality
  | Division
  | District
  | Sub_District
  | Post_Office
  | Village;

// Optional type preserved as comment
// export type GeographyEntityType = 'nationality' | 'division' | 'district' | 'subDistrict' | 'postOffice' | 'village';

/** ============================
 * Create DTOs
 * ============================ */

export interface CreateNationalityDto {
  name: string;
}

export interface CreateDivisionDto {
  name: string;
  nationalityId: string;
}

export interface CreateDistrictDto {
  name: string;
  divisionId: string;
}

export interface CreateSubDistrictDto {
  name: string;
  districtId: string;
}

export interface CreatePostOfficeDto {
  name: string;
  subDistrictId: string;
}

export interface CreateVillageDto {
  name: string;
  postOfficeId: string;
}

/** ============================
 * Update DTOs
 * ============================ */

export interface UpdateNationalityDto {
  name?: string;
}

export interface UpdateDivisionDto {
  name?: string;
  nationalityId?: string;
}

export interface UpdateDistrictDto {
  name?: string;
  divisionId?: string;
}

export interface UpdateSubDistrictDto {
  name?: string;
  districtId?: string;
}

export interface UpdatePostOfficeDto {
  name?: string;
  subDistrictId?: string;
}

export interface UpdateVillageDto {
  name?: string;
  postOfficeId?: string;
}

/** ============================
 * Filters and Tree View Types
 * ============================ */

export interface GeographyFilters {
  search?: string;
  nationalityId?: string;
  divisionId?: string;
  districtId?: string;
  subDistrictId?: string;
  postOfficeId?: string;
}

export interface GeographyTreeNode {
  id: string;
  name: string;
  type: GeographyEntityType;
  children?: GeographyTreeNode[];
  parentId?: string;
  expanded?: boolean;
}

export type ViewMode = 'normal' | 'tree';