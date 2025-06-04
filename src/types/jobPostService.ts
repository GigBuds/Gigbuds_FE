export interface JobShift {
  id?: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface JobSchedule {
  shiftCount: number;
  minimumShift: number;
  jobShifts: JobShift[];
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
  userId?: string;
  status?: 'active' | 'inactive' | 'expired';
  applicationsCount?: number;
  districtCode?: string;
  provinceCode?: string;
  jobPositionId?: string;

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
  userId?: string;
  search?: string;
  location?: string;
  employmentType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateJobPostRequest {
  jobTitle: string;
  jobDescription: string;
  jobLocation?: string;
  salary?: number;
  salaryUnit?: string;
  jobRequirement?: string;
  experienceRequirement?: string;
  benefit?: string;
  expireTime?: string;
  vacancyCount: number;
  jobSchedule?: JobSchedule;
}

export interface UpdateJobPostRequest extends Partial<CreateJobPostRequest> {
  status?: 'active' | 'inactive' | 'expired';
  isOutstandingPost?: boolean;
}