export interface JobShift {
  jobShiftId: string
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface JobShiftRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface JobSchedule {
  shiftCount: number;
  minimumShift: number;
  jobShifts: JobShift[];
}

export interface JobScheduleRequest {
  shiftCount: number;
  minimumShift: number;
  jobShifts: JobShiftRequest[];
}

export interface JobPost {
  id: number;
  jobTitle: string;
  jobDescription: string;
  ageRequirement?: string;
  jobLocation?: string;
  salary?: number;
  salaryUnit?: string;
  jobRequirement?: string;
  experienceRequirement?: string;
  benefit?: string;
  expireTime: string;
  isOutstandingPost: boolean;
  vacancyCount: number;
  jobSchedule?: JobSchedule;
  employerId?: string;
  status?: 'active' | 'inactive' | 'expired';
  applicationsCount?: number;
  districtCode?: string;
  provinceCode?: string;
  jobPositionId?: number;

}

export interface JobPositionOption {
  id: number;
  jobPositionName: string;
  jobTypeId: number;
  jobTypeName: string;
}

export interface JobPostDialogProps {
  API_KEY: string;
  MAP_ID: string;
  job: JobPost;
  children: React.ReactNode;
  onJobUpdated?: (updatedJob: JobPost) => void;
}

export interface JobPostsResponse {
  data: JobPost[];
  items: JobPost[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  message?: string;
}

export interface GetJobPostsParams {
  pageSize?: number;
  pageIndex?: number;
  employerId?: string;
  search?: string;
  location?: string;
  employmentType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateJobPostRequest {
    accountId: number;
    jobTitle: string;
    ageRequirement: string;
    jobDescription: string;
    jobRequirement: string;
    experienceRequirement: string;
    salary: number;
    salaryUnit: string;
    jobLocation: string | null | undefined;
    expireTime: string;
    benefit: string;
    vacancyCount: number;
    districtCode: string;
    provinceCode: string;
    jobPositionId: string;
    jobSchedule: JobScheduleRequest;
    startDate: string;
    endDate: string;
}

export interface UpdateJobPostRequest extends Partial<CreateJobPostRequest> {
  status?: 'active' | 'inactive' | 'expired';
  isOutstandingPost?: boolean;
}

export interface JobPosition {
  id: number;
  jobPositionName?: string;
  jobTypeName?: string;
}