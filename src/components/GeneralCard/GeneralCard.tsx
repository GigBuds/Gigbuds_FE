"use client";
import loa from "../../../public/GC-loa.png";
import task from "../../../public/GC-task.png";
import newapp from "../../../public/GC-newHS.png";

import Image from "next/image";


const GeneralCard = () => {
    const data = [
        {
            title: "Tin tuyển dụng ",
            value: 10,
            icon: "job-icon.png"
        },
        {
            title: "Hồ sơ đã tiếp nhận",
            value: 20,
            icon: "application-icon.png"
        },
        {
            title: "Hồ sơ mới",
            value: 15,
            icon: "user-icon.png"
        }
    ]
    return (
        <>
            <div className="flex flex-row items-center bg-white justify-center w-[80%] gap-[2%]  h-fit ">
                {data.map((item, index) => (
                    <div key={index} className="flex p-4 w-[33%]  rounded-2xl  border-1 border-gray-200 flex-row items-center">
                        <Image
                            src={index === 0 ? loa : index === 1 ? task : newapp}
                            alt={item.title}
                            className="w-16 h-16"
                            style={{ objectFit: "contain" }}
                        />
                        <div className="flex flex-col w-full  ml-4">
                            <p className="text-xl text-[#FF7345] font-bold">{item.value}</p>
                            <p className="text-sm text-gray-600">{item.title}</p>
                        </div>

                    </div>
                ))}

            </div>
        </>
    )
}

export default GeneralCard