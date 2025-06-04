import React from 'react'
import ManageApplication from './ManageApplication'

interface PageProps {
  params: {
    id: string;
  }
}

const page = ({ params }: PageProps) => {
  const selectedJob = {
    id: parseInt(params.id),
  };


  return (
    <div className='flex w-full  p-5'>
      <ManageApplication selectedJob={selectedJob}  />
    </div>
  )
}

export default page