import React from "react";
import CreateForm from "./CreateForm";

export default function CreateJobPost() {
    

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
  const MAP_ID = process.env.GOOGLE_MAPS_MAP_ID ?? "";
  

  return (
    <div className="max-w-[1000px]">
      <CreateForm API_KEY={API_KEY} MAP_ID={MAP_ID}></CreateForm>
    </div>
  );
}