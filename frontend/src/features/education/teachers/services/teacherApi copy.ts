import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherFilters,
  TeacherDetail, // Import TeacherDetail
} from '../types/teacherType';
import type { PaginatedResponse } from '~/shared/types/common';
import { generalApi } from '~/features/core/services/generalApi'; // Import generalApi to get designations

/**
 * Mock data for development
 */
const mockTeachers: Teacher[] = [
  {
    id: 't1',
    firstName: 'Ahmed',
    lastName: 'Rahman',
    dateOfBirth: '1985-05-15',
    placeOfBirth: 'Dhaka, Bangladesh',
    fatherName: 'Mohammad Rahman',
    motherName: 'Fatima Rahman',
    mobileNumber: '+880 1712-345678',
    emailAddress: 'ahmed.rahman@email.com',
    emergencyContact: '+880 1812-987654',
    nationalId: '1234567890123',
    photoUrl: '/mock/photos/ahmed-rahman.jpg',

    // Demographics
    genderId: 'g1', // Male
    bloodGroupId: 'bg1', // A+
    nationalityId: 'n1', // Bangladesh
    maritalStatusId: 'ms2', // Married
    relationId: 'rel1', // Self

    // Address Information
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    sameAsPresent: true,

    // Educational Qualifications
    educationalQualifications: [
      {
        id: 'eq1',
        degreeName: 'Bachelor of Science in Mathematics',
        institution: 'University of Dhaka',
        year: '2007',
        grade: 'First Class',
        documentUrl: '/mock/documents/bsc-certificate.pdf',
      },
      {
        id: 'eq2',
        degreeName: 'Master of Science in Mathematics',
        institution: 'University of Dhaka',
        year: '2009',
        grade: 'First Class',
        documentUrl: '/mock/documents/msc-certificate.pdf',
      },
    ],

    // Professional Experience
    professionalExperience: [
      {
        id: 'pe1',
        companyName: 'ABC High School',
        jobTitle: 'Mathematics Teacher',
        startDate: '2010-01-01',
        endDate: '2015-12-31',
        responsibilities: 'Teaching mathematics to grades 9-12, preparing lesson plans, conducting assessments',
        achievements: 'Improved student performance by 25% in board examinations',
      },
      {
        id: 'pe2',
        companyName: 'XYZ College',
        jobTitle: 'Senior Mathematics Teacher',
        startDate: '2016-01-01',
        responsibilities: 'Teaching advanced mathematics, mentoring junior teachers, curriculum development',
        achievements: 'Developed innovative teaching methods that increased student engagement',
      },
    ],

    // References
    references: [
      {
        id: 'ref1',
        name: 'Dr. Mohammad Ali',
        relationship: 'Former Principal',
        contactNumber: '+880 1712-111111',
        email: 'mohammad.ali@abcschool.edu',
        recommendationLetterUrl: '/mock/documents/recommendation-1.pdf',
      },
      {
        id: 'ref2',
        name: 'Prof. Sarah Khan',
        relationship: 'Department Head',
        contactNumber: '+880 1812-222222',
        email: 'sarah.khan@xyzcollege.edu',
      },
    ],

    // Employment Details
    salaryExpectation: 50000,
    joiningDate: '2024-01-01',
    digitalSignatureUrl: '/mock/signatures/ahmed-signature.png',
    yearsOfExperience: 14,
    noticePeriod: '2 months',
    designationIds: ['d1'], // Add designationId

    // Teaching Specialization
    subjectIds: ['sub1', 'sub3'], // Mathematics, Science
    gradeLevelIds: ['gl2', 'gl3'], // Secondary, Higher Secondary
    languageProficiencyIds: ['lp1', 'lp2'], // Bengali, English

    // Skills & Competencies
    computerSkills: 'Microsoft Office, Google Workspace, Educational Software',
    teachingMethodology: 'Interactive learning, Problem-based learning, Technology integration',
    onlineProfiles: {
      linkedin: 'https://linkedin.com/in/ahmed-rahman',
      personalWebsite: 'https://ahmed-math-teacher.com',
    },

    // Additional Information
    details: 'Experienced mathematics teacher with a passion for innovative teaching methods.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    firstName: 'Fatima',
    lastName: 'Begum',
    dateOfBirth: '1988-08-22',
    placeOfBirth: 'Chittagong, Bangladesh',
    fatherName: 'Abdul Karim',
    motherName: 'Rashida Begum',
    mobileNumber: '+880 1812-987654',
    emailAddress: 'fatima.begum@email.com',
    emergencyContact: '+880 1712-345678',
    nationalId: '9876543210987',
    photoUrl: '/mock/photos/fatima-begum.jpg',

    // Demographics
    genderId: 'g2', // Female
    bloodGroupId: 'bg3', // B+
    nationalityId: 'n1', // Bangladesh
    maritalStatusId: 'ms1', // Single
    relationId: 'rel1', // Self

    // Address Information
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
      subDistrictId: 'sd2',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    sameAsPresent: true,

    // Educational Qualifications
    educationalQualifications: [
      {
        id: 'eq3',
        degreeName: 'Bachelor of Arts in English',
        institution: 'University of Chittagong',
        year: '2010',
        grade: 'First Class',
        documentUrl: '/mock/documents/ba-english-certificate.pdf',
      },
    ],

    // Professional Experience
    professionalExperience: [
      {
        id: 'pe3',
        companyName: 'DEF School',
        jobTitle: 'English Teacher',
        startDate: '2011-01-01',
        responsibilities: 'Teaching English language and literature, organizing cultural events',
        achievements: 'Led school to win inter-school debate competition',
      },
    ],

    // References
    references: [
      {
        id: 'ref3',
        name: 'Dr. Aminul Islam',
        relationship: 'Former Supervisor',
        contactNumber: '+880 1713-333333',
        email: 'aminul.islam@defschool.edu',
      },
    ],

    // Employment Details
    salaryExpectation: 40000,
    yearsOfExperience: 13,
    noticePeriod: '1 month',
    designationIds: ['d1'], // Add designationId

    // Teaching Specialization
    subjectIds: ['sub2'], // English
    gradeLevelIds: ['gl1', 'gl2'], // Primary, Secondary
    languageProficiencyIds: ['lp1', 'lp2'], // Bengali, English

    // Skills & Competencies
    computerSkills: 'Microsoft Office, Online Teaching Platforms',
    teachingMethodology: 'Communicative approach, Literature-based learning',

    // Additional Information
    details: 'Dedicated English teacher with expertise in language and literature.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Teacher API service class
 */
class TeacherApiService extends BaseApiService {
  private teachers = [...mockTeachers];
  private mockIdCounter = 100;

  /**
   * Helper to populate designation details
   */
  // Make this method async
  private async populateTeacherDetails(teacher: Teacher): Promise<TeacherDetail> {
    // Await the asynchronous call to generalApi.getAllSimpleEntities()
    const { designations } = await generalApi.getAllSimpleEntities();
    const teacherDesignations = teacher.designationIds
      ? teacher.designationIds.map(id => {
        const found = designations.find(d => d.id === id);
        return found ? { id: found.id, name: found.name } : undefined;
      }).filter(Boolean) as { id: string; name: string }[]
      : [];
    return {
      ...teacher,
      designations: teacherDesignations,
    };
  }

  /**
   * Get teachers with pagination and filtering
   */
  async getTeachers(params: { page?: number; limit?: number; filters?: TeacherFilters } = {}): Promise<PaginatedResponse<TeacherDetail>> { // Change return type to TeacherDetail
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.teachers];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(teacher =>
        teacher.firstName.toLowerCase().includes(search) ||
        teacher.lastName.toLowerCase().includes(search) ||
        teacher.emailAddress.toLowerCase().includes(search) ||
        teacher.mobileNumber.includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(teacher => teacher.status === filters.status);
    }

    if (filters.genderId) {
      filtered = filtered.filter(teacher => teacher.genderId === filters.genderId);
    }

    if (filters.subjectId) {
      filtered = filtered.filter(teacher => teacher.subjectIds.includes(filters.subjectId!));
    }

    if (filters.gradeLevelId) {
      filtered = filtered.filter(teacher => teacher.gradeLevelIds.includes(filters.gradeLevelId!));
    }

    if (filters.designationIds && filters.designationIds.length > 0) {
      filtered = filtered.filter(teacher => 
        teacher.designationIds && 
        teacher.designationIds.some(id => filters.designationIds!.includes(id))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    // Use Promise.all to await all populateTeacherDetails calls
    const dataPromises = filtered.slice(startIndex, startIndex + limit).map(t => this.populateTeacherDetails(t));
    const data = await Promise.all(dataPromises);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Get teacher by ID
   */
  async getTeacherById(id: string): Promise<TeacherDetail> { // Change return type to TeacherDetail
    await this.simulateDelay(200);
    const teacher = this.teachers.find(t => t.id === id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    // Await the asynchronous populateTeacherDetails call
    return await this.populateTeacherDetails(teacher);
  }

  /**
   * Create new teacher
   */
  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    await this.simulateDelay(500);

    // Generate IDs for nested arrays
    const educationalQualifications = data.educationalQualifications.map((eq, index) => ({
      ...eq,
      id: `eq${this.mockIdCounter + index}`,
    }));

    const professionalExperience = data.professionalExperience.map((pe, index) => ({
      ...pe,
      id: `pe${this.mockIdCounter + 100 + index}`,
    }));

    const references = data.references.map((ref, index) => ({
      ...ref,
      id: `ref${this.mockIdCounter + 200 + index}`,
    }));

    const newTeacher: Teacher = {
      id: `t${this.mockIdCounter++}`,
      ...data,
      educationalQualifications,
      professionalExperience,
      references,
      createdAt: new Date().toISOString(),
      // designationId is already part of ...data
    };

    this.teachers = [newTeacher, ...this.teachers];
    return newTeacher;
  }

  /**
   * Update teacher
   */
  async updateTeacher(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    await this.simulateDelay(500);
    const index = this.teachers.findIndex(teacher => teacher.id === id);
    if (index === -1) {
      throw new Error('Teacher not found');
    }

    this.teachers[index] = {
      ...this.teachers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.teachers[index];
  }

  /**
   * Delete teacher
   */
  async deleteTeacher(id: string): Promise<void> {
    await this.simulateDelay(300);
    const index = this.teachers.findIndex(teacher => teacher.id === id);
    if (index === -1) {
      throw new Error('Teacher not found');
    }

    this.teachers = this.teachers.filter(teacher => teacher.id !== id);
  }
}

export const teacherApi = new TeacherApiService();