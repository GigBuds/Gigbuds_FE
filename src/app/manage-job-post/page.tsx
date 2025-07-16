import React from 'react'
import ManageJobPost from './ManageJobPost'

const page = async () => {
    // These environment variables are now safely accessed on the server
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
    const MAP_ID = process.env.GOOGLE_MAPS_MAP_ID ?? "";

    return (
        <div className='flex h-full w-full items-center justify-center p-5'>
            <ManageJobPost API_KEY={API_KEY} MAP_ID={MAP_ID} />
        </div>
    )
}

export default page