import fetchApi from "@/api/api";
import CreateForm from "./CreateForm";
import { JobPosition } from "@/types/jobPostService";

export default async function CreateJobPost() {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
  const MAP_ID = process.env.GOOGLE_MAPS_MAP_ID ?? "";
  
  const jobPositions: JobPosition[] = await fetchApi.get('job-positions');
  const groupedJobPositions = jobPositions.reduce((acc, jobPosition) => {
    const typeName = jobPosition.jobTypeName ?? 'Khác';
    acc[typeName] ??= [];
    acc[typeName].push(jobPosition);
    return acc;
  }, {} as Record<string, JobPosition[]>);

  return (
    <div className="m-auto">
      <CreateForm API_KEY={API_KEY} MAP_ID={MAP_ID} jobPositions={groupedJobPositions}></CreateForm>
    </div>
  );
}