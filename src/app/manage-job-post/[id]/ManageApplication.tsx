/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useLoading } from "@/contexts/LoadingContext";
import { applicationApi } from "@/service/applicationService/applicationService";
import { Application } from "@/types/applicationService";
import { Job } from "@/types/jobPost.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ManageApplicationProps {
  selectedJob: Job | null;
}

const ManageApplication = ({
  selectedJob,
}: ManageApplicationProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // Helper function to safely render skill tags
  const renderSkillTag = (tag: unknown): string => {
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag && 'skillName' in tag) return (tag as any).skillName;
    if (typeof tag === 'object' && tag && 'name' in tag) return (tag as any).name;
    return 'Skill';
  };

  // Fetch applications when component mounts or selectedJob changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJob?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await applicationApi.getApplicationsByJobPostId(
          selectedJob.id.toString()
        );
        console.log("Applications API response:", response);
        // Handle the response - it seems to be an array directly
        if (Array.isArray(response)) {
          setApplications(response);
        } else if (response.data && Array.isArray(response.data)) {
          setApplications(response.data);
        } else if (response.items && Array.isArray(response.items)) {
          setApplications(response.items);
        } else {
          console.warn("Unexpected response format:", response);
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setTimeout(() => {
          setIsLoading(false); // Stop loading after a delay
        }
          , 2000); // Adjust the delay as needed
      }
    };

    fetchApplications();
  }, [selectedJob?.id]);

  console.log("Applications:", applications);

  // Handle status update
  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, newStatus);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus as Application["applicationStatus"] }
            : app
        )
      );

      console.log(
        `Application ${applicationId} status updated to ${newStatus}`
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };


  return (
    <div className="w-full flex flex-col">
      <div className="flex-row flex justify-between">
        <div className="text-lg text-black px-4 w-fit py-2 rounded">
          Tin tuyển dụng / Xem hồ sơ ứng viên / Job ID: {selectedJob?.id}
        </div>
        <div
          onClick={() => window.history.back()}
          className="bg-orange-500 text-lg justify-center flex text-center items-center text-white px-8 w-fit  rounded">
          Back

        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          Lỗi: {error}
        </div>
      )}

      <div className="w-full flex flex-wrap gap-6 mt-[2%] overflow-y-auto pb-4 px-3 overflow-hidden h-[81vh]">
        {applications.length === 0 ? (
          <div className="w-full text-center text-gray-500 mt-8">
            Chưa có ứng viên nào ứng tuyển cho vị trí này.
          </div>
        ) : (
          applications.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white border-l-2 border-blue-500 col-span-1 w-[40%] p-[2%] rounded-lg h-fit shadow-xl"
            >
              <div className="flex flex-row items-center gap-[5%]">
                <div className="w-[70px] bg-gray-300 py-[4%] rounded-full h-[60px] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {(applicant.firstName && applicant.firstName.charAt(0).toUpperCase()) ||
                      (applicant.lastName && applicant.lastName.charAt(0).toUpperCase()) ||
                      'U'}
                  </span>
                </div>
                <div className="flex flex-col w-[60%]">
                  <h2 className="text-md font-semibold truncate w-[100%]">
                    {applicant.lastName || ''} {applicant.firstName || ''}
                  </h2>
                  <div className="flex flex-row gap-1">
                    <p className="text-xs text-gray-600">ID: {applicant.accountId}</p>
                    <span className="text-xs text-gray-600">-</span>
                    <p className="text-xs text-gray-600">
                      {(() => {
                        if (!applicant.appliedAt) return "Chưa rõ thời gian";
                        const appliedDate = new Date(applicant.appliedAt);
                        const today = new Date();
                        const diffTime = Math.abs(
                          today.getTime() - appliedDate.getTime()
                        );
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays === 0) return "Hôm nay";
                        return `${diffDays} ngày trước`;
                      })()}
                    </p>
                  </div>
                </div>
                <div onClick={() => {
                  router.push(`/manage-job-post/${selectedJob?.id}/user-profile/${applicant.accountId}`);
                }} className="justify-end w-[25%] text-xs text-orange-400 flex flex-row items-center cursor-pointer hover:text-orange-600">
                  Xem hồ sơ {">"}
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 py-[2%]">
                <p className="text-sm items-center text-white bg-orange-500 px-2 py-1 rounded-full inline-block">
                  Ứng viên mới
                </p>
                <div className="gap-2 flex">
                  {applicant.skillTags && applicant.skillTags.length > 0 ? (
                    <>
                      {applicant.skillTags.slice(0, 2).map((tag, index) => (
                        <div
                          key={index}
                          className="text-[70%] font-semibold items-center text-gray-500 border-gray-500 border-1 bg-white px-2 py-1 rounded-full inline-block"
                        >
                          {renderSkillTag(tag)}
                        </div>
                      ))}
                      {applicant.skillTags.length > 2 && (
                        <div className="text-sm text-gray-500 border-gray-500 border-1 bg-white px-2 py-1 rounded-full inline-block">
                          +{applicant.skillTags.length - 2}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 border-gray-500 border-1 bg-white px-2 py-1 rounded-full inline-block">
                      Chưa có kỹ năng
                    </div>
                  )}
                </div>
              </div>

              <p className="text-lg text-gray-600 pb-[2%]">
                Vị trí ứng tuyển: {applicant.jobPosition || 'N/A'}
              </p>

              <div
                onClick={() => {
                  if (applicant.cvUrl) {
                    window.open(applicant.cvUrl, "_blank");
                  }
                }}
                className={`flex flex-row items-center cursor-pointer transition-colors duration-200 ${applicant.cvUrl
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                  } w-full justify-center py-[2%] rounded-lg`}
              >
                <p className="text-lg text-white">
                  {applicant.cvUrl ? "Xem CV đính kèm" : "Không có CV đính kèm"}
                </p>
              </div>

              {/* Status update buttons */}
              <div className="flex flex-row gap-2 mt-[2%]">
                <button
                  onClick={() => handleStatusUpdate(applicant.id.toString(), 'approved')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1 rounded transition-colors"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => handleStatusUpdate(applicant.id.toString(), 'rejected')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1 rounded transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleStatusUpdate(applicant.id.toString(), 'reviewed')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded transition-colors"
                >
                  Đã xem
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageApplication;
