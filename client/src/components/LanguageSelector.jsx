import { ChevronDown, ChevronUp, DropletOffIcon } from 'lucide-react';
import React, { useContext } from 'react'
import { useState } from 'react';
import { LANGUAGES } from '../lib/languages';
import { Room } from '../context/RoomContext';
//const LANGUAGES = [{lang:"python",version:"3.1"},{lang:"java",version:"3.2"},{lang:"javascript",version:"3.3"}];
const LanguageSelector = ({activeLanguage={lang:"python",version:"3.1"},setActiveLanguage=()=>{}}) => {
    
    const [isOpen,setIsOpen] = useState(false);
    const {liveLanguage} = useContext(Room);
    //console.log(`Current Language: ${liveLanguage},${activeLanguage}`)
  return (
    <div className='mt-2 mb-1 min-w-[20vw] mx-auto max-md:text-[14px] bg-zinc-900 py-2 pl-1'>
      <div className='p-1 relative flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <span className='text-md'>{liveLanguage || activeLanguage}</span>
            <span className='text-[12px] text-zinc-500'>{ liveLanguage ? "":activeLanguage?.version}</span> 
        </div>
        
            <span className='cursor-pointer' onClick={()=>setIsOpen(!isOpen)}> 
                {!isOpen?<ChevronDown size={"20px"}/>:<ChevronUp size={"20px"}/> }
              </span>


            {isOpen && <div className='z-2 absolute w-full top-full bg-[#181818] transform translate-y-px left-0 transition-all duration-300 ease-in-out'> 
                    {LANGUAGES.length > 0 && LANGUAGES.map((language,idx)=>{
                        if(language.lang === activeLanguage || liveLanguage === language.lang) return null
                return <div className='flex items-center gap-2 cursor-pointer hover:bg-zinc-800 px-1 py-2' key={idx} onClick={()=>{setActiveLanguage(language);setIsOpen(false)}}>
                    <span className='text-md'>{language.lang}</span>
                    <span className='text-[12px] text-zinc-500'>{language.version}</span>
                    
                </div>
            })}
                </div>}
      </div>
    </div>
  )
}

export default LanguageSelector
