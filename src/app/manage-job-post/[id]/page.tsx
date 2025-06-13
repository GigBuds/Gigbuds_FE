import React from 'react'
import ManageApplication from './ManageApplication'

// Use the exact typing that Next.js expects
interface PageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

const page = async ({ params }: PageProps) => {
  // Handle both Promise and direct params
  const resolvedParams = await Promise.resolve(params);
  
  const selectedJob = {
    id: parseInt(resolvedParams.id),
  };

  return (
    <div className='flex w-full p-5'>
      <ManageApplication selectedJob={selectedJob}  />
    </div>
  )
}

export default page