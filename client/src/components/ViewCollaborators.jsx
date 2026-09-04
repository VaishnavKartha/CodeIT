import { XIcon } from 'lucide-react';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { Room } from '../context/RoomContext';
import { useMemo } from 'react';

const COLORS = ["#0092CD","#FF3334","#B6B326","#5C7929"];
const CollabIcon=({userIcon})=>{
    return(
        <div style={{backgroundColor:`${COLORS[Math.floor(Math.random()*COLORS.length)]}`}} className='hidden md:flex border-0 justify-center items-center h-12 w-12 rounded-full aspect-square -ml-4 cursor-pointer'>
            <p>{userIcon[0].toUpperCase()}</p>
        </div>
    )
}

const ListAllCollaborators=({members,isOpen,setIsOpen=()=>{}})=>{
    const {onlineMembers} = useContext(Room);

    const onlineIds = useMemo(
        () => new Set(onlineMembers.map(u => u.id)),
        [onlineMembers]
    );

    return (
        <div 
        className={`z-10 px-2 py-4 fixed h-screen left-full min-w-60 
                    bg-[#181818] transform ${isOpen? "-translate-x-full":"translate-x-full"} 
                    transition-transform duration-500 ease-in-out `}>
            
            <div className='flex  items-center'>
                <XIcon onClick={()=>setIsOpen(false)} size={"20px"} className='cursor-pointer'/>

                    <h1 className='flex-1 text-center text-2xl'>Collaborators</h1>

            </div>

            <div className='overflow-y-scroll mt-4'>
                {members?.length>0 ? members.map((mem,idx)=>{
                    return <div className='bg-zinc-950 w-full flex mb-2 p-2 rounded-md'>
                        <div>
                            <p>{mem.userId.username}</p>
                            <p className='text-[13px] text-zinc-400'>{mem.userId.email}</p>
                            <p className='text-[12px] text-zinc-400'>{mem?.role}</p>
                            <p className='text-[12px] text-zinc-400'>Status:{onlineIds.has(mem?.userId?._id) ? <span className='text-green-600'>Online</span>:<span className='text-red-700'>Offline</span>}</p>
                        </div>
                        <span></span>
                    </div>
                }):<span></span>}

            </div>

        </div>
    )

}




const ViewCollaborators = ({roomMembers}) => {
    const [isOpen,setIsOpen] = useState(false);
  return (
    <>
        <div className='flex relative mr-4 md:mr-12 items-center'>
        {roomMembers.length > 0 && roomMembers.slice(0,3).map((member,index)=>{
                
            return <CollabIcon key={index} userIcon={member.userId.username}/>
        })}

            <div onClick={()=>setIsOpen(true)} className='text-[14px] text-zinc-300 cursor-pointer mt-auto'>view all</div>
        </div>

        <ListAllCollaborators members = {roomMembers} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  )
}

export default ViewCollaborators
