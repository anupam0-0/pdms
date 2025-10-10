"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useHealthCheck } from '../hooks/useHealthCheck';


const CheckHealth = () => {
    const { data, loading, error, fetchHealth } = useHealthCheck();
    // console.log(data)

    return (
        <div className='flex flex-col gap-4 border-t py-6' >       
            {/* <h1 className='text-xl'>Check Health</h1> */}
            <Button variant='outline' className='w-fit' onClick={fetchHealth} aria-label='health' disabled={loading}> {loading ? "Checking..." : "Check Health"}</Button>
            {error && <p className="text-red-500">Error: {error}</p>}
            {loading && <p className="text-neutral-500">Loading... </p>}
            {!error && !loading && data && <p className="text-green-500">{data}</p>}
        </div>
    )
}

export default CheckHealth