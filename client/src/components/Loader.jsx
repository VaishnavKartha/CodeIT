import React from 'react'

const Loader = () => {
  console.log("loader");
  return (
    <div className='fixed inset-0 bg-transparent flex justify-center items-center'>
      <div className=' w-12 h-12 rounded-full border-2 border-white border-b-blue-500 animate-spin'/>
    </div>
  )
}

export default Loader
