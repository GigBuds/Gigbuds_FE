import React from "react";
// Define a proper type for the job object
interface Job {
  id: number;
  title: string;
  status: string;
  numberOfApplicants: number;
  numberOfViews: number;
  numberOfFeedbacks: number;
  expireTime: string;
}

interface ManageApplicationProps {
  setViewNumberOfApplicants: (value: boolean) => void;
  selectedJob: Job | null;
}

const ManageApplication = ({
  setViewNumberOfApplicants,
  selectedJob,
}: ManageApplicationProps) => {
  const applicants = [
    {
      id: 1,
      Avatar:
        "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff&size=64",
      name: "Nguyen Van A",
      skillTags: ["JavaScript", "React", "Node.js", "CSS", "HTML"],
      position : "Software Engineer",
      appliedDate: "2024-10-01",
      location: "Hanoi",
      suitableForJob: "80%",
      withCoverLetter: true,
    },
    {
      id: 2,
      Avatar:
        "https://ui-avatars.com/api/?name=Tran+Thi+B&background=059669&color=fff&size=64",
      name: "Tran Thi B",
      skillTags: ["Python", "Django", "Machine Learning"],
      position : "Software Engineer",
      appliedDate: "2024-10-02",
      location: "Ho Chi Minh City",
      suitableForJob: "90%",
      withCoverLetter: false,
    },
    {
      id: 3,
      Avatar:
        "https://ui-avatars.com/api/?name=Le+Van+C&background=DC2626&color=fff&size=64",
      name: "Le Van C",
      skillTags: ["Java", "Spring Boot", "Microservices"],
      position : "Software Engineer",
      appliedDate: "2024-10-03",
      location: "Da Nang",
      suitableForJob: "85%",
      withCoverLetter: true,
    },
    {
      id: 4,
      Avatar:
        "https://ui-avatars.com/api/?name=Pham+Thi+D&background=7C3AED&color=fff&size=64",
      name: "Pham Thi D",
      skillTags: ["C#", ".NET", "Azure"],
      position : "Software Engineer",
      appliedDate: "2024-10-04",
      location: "Hanoi",
      suitableForJob: "75%",
      withCoverLetter: false,
    },
    {
      id: 5,
      Avatar:
        "https://ui-avatars.com/api/?name=Nguyen+Van+E&background=EA580C&color=fff&size=64",
      name: "Nguyen Van E",
      skillTags: ["PHP", "Laravel", "MySQL"],
      appliedDate: "2024-10-05",
      location: "Ho Chi Minh City",
      suitableForJob: "80%",
      withCoverLetter: true,
    },
  ];
  return (
    <div className="h-full">
      <div>
        <div
          onClick={() => setViewNumberOfApplicants(false)}
          className="bg-orange-500 text-sm text-white px-4 w-fit py-2 rounded"
        >
          Tin tuyển dụng / Xem hồ sơ ứng viên / {selectedJob ? selectedJob.title : "Chưa chọn"}
        </div>
      </div>

      <div className=" w-full flex flex-wrap gap-6 mt-[2%] overflow-y-auto pb-4 px-3 overflow-hidden h-[81vh]">
        {applicants.map((applicant) => (
          <div
            key={applicant.id}
            className="bg-white border-l-2 border-blue-500 col-span-1 w-[40%] p-[2%]  rounded-lg shadow-xl"
          >
            <div className="flex flex-row items-center gap-[5%]">
              <div className="w-[15%] bg-black py-[4%] rounded-full h-[100%]">
                .asa
              </div>
              <div className="flex flex-col w-[60%]">
                <h2 className="text-md font-semibold truncate w-[100%]">
                  {applicant.name}
                </h2>
                <div className="flex flex-row gap-1">
                  <p className="text-xs text-gray-600">{applicant.location}</p>
                  <span className="text-xs text-gray-600">-</span>
                  <p className="text-xs text-gray-600">
                    {(() => {
                      const appliedDate = new Date(applicant.appliedDate);
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
              <div className="justify-end w-[25%] text-xs text-orange-400 flex flex-row items-center ">
                Xem hồ sơ {">"}
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 py-[2%] ">
            <p className="text-sm text-white bg-orange-500 px-2 py-1 rounded-full inline-block ">
              {applicant.suitableForJob}  phù hợp
            </p>
            <div className="gap-2 flex" >
            {applicant.skillTags.slice(0, 2).map((tag, index) => (
                <div key={index} className="text-sm text-gray-500 border-gray-500 border-1 bg-white px-2 py-1 rounded-full inline-block">
                    {tag}
                </div>
            ))}
            {applicant.skillTags.length > 2 && (
                <div className="text-sm text-gray-500 border-gray-500 border-1 bg-white px-2 py-1 rounded-full inline-block">
                    +{applicant.skillTags.length - 2}
                </div>
            )}
            </div>
            </div>
           
            <p className="text-lg text-gray-600 pb-[2%]">
              Vị trí ứng tuyển: {applicant.position}
            </p>
            
            <div className={`flex flex-row items-center ${applicant.withCoverLetter ? 'bg-blue-600' : 'bg-gray-400' }  w-full justify-center py-[2%] rounded-lg`}>
                <p className="text-lg text-white">
                    {applicant.withCoverLetter ? "Xem CV đính kèm" : "Không có CV đính kèm"}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageApplication;
