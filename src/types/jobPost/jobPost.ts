import { JobSchedule } from "./jobSchedule";

export interface JobPost {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JobPostCreate {
    accountId: number;
    jobTitle: string;
    jobDescription: string;
    jobRequirement: string;
    experienceRequirement: string;
    salary: number;
    salaryUnit: string;
    jobLocation: string | null | undefined;
    expireTime: string;
    benefit: string;
    vacancyCount: number;
    isOutstandingPost: boolean;
    jobSchedule: JobSchedule;
}

export interface JobPostUpdate {
    jobTitle?: string;
    jobDescription?: string;
    jobRequirement?: string;
    experienceRequirement?: string;
    salary?: number;
    salaryUnit?: string;
    jobLocation?: string;
    expireTime?: string;
    benefit?: string;
    vacancyCount?: number;
    isOutstandingPost?: boolean;
    jobSchedule?: JobSchedule;
}

export interface JobPostDelete {
    id: string;
}
