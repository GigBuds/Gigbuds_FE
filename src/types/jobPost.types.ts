export interface Job {
  id: number;
  title: string;
  status: string;
  numberOfApplicants: number;
  numberOfViews: number;
  numberOfFeedbacks: number;
  expireTime: string;
}