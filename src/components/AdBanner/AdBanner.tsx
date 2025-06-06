"use client";
import Image from "next/image"
import banner from "../../../public/BannerAd.png";

const AdBanner = () => {
  return (
    <>
        <div className="flex flex-row items-center bg-white justify-center w-[35%]  h-fit gap-[30%]">
        <Image
          src={banner}
          alt="Banner Ad"
          style={{ objectFit: "contain" }}
        
        />
        <Image
          src={banner}
          alt="Banner Ad"
          style={{ objectFit: "contain" }}
        
        />
      </div>
    </>
  )
}

export default AdBanner