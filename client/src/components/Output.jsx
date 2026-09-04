import React from 'react'

const Output = ({output={}}) => {
    const {stdout,stderr,timedOut} = output;
  return (
    <div className='bg-zinc-800 p-2 wrap-break-word overflow-y-scroll'>
      {

      stdout ? <span>{stdout}</span> : 
      stderr ? <span className='text-red-600'>{stderr}</span> : 
      timedOut ? <span className='text-red-600'>TLE</span> : 
      <span className='text-sm text-zinc-400'>Run Code to See output !!</span>
      
      }
    </div>
  )
}

export default Output
