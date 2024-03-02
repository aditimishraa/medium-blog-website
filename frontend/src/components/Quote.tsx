import React from 'react'

const Quote = () => {
  return (
    <div className='bg-slate-200 h-screen flex justify-center flex-col' >
        <div className='flex justify-center'>
            <div className='max-w-lg'>
                <div className='text-3xl font-bold'>
                    "The customer support i recieved was expectional. The support team went above and beyond o address my concerns."
                </div>
                <div className='max-w-md text-xl font-semibold mt-4'>
                    Julies Wnfield
                </div>
                <div className='max-w-md text-sm font-light font-opacity-0 text-slate-400'>
                    CEO | Acme Inc.
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Quote