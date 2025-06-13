import React from 'react'
import ManageApplication from './ManageApplication'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  const selectedJob = {
    id: parseInt(id),
  };

  return (
    <div className='flex w-full p-5'>
      <ManageApplication selectedJob={selectedJob} />
    </div>
  )
}

export default page