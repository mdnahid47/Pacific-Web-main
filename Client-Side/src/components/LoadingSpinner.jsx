import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div >

                <span className="loading loading-dots loading-xs"></span>
                <span className="loading loading-dots loading-sm"></span>
                <span className="loading loading-dots loading-md"></span>
                <span className="loading loading-dots loading-lg"></span>

            </div>
        </div>
    )
}

export default LoadingSpinner