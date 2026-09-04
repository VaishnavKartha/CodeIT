import React from 'react'
import useEdit from '../Hooks/useEdit';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { useContext } from 'react';
import { Room } from '../context/RoomContext';
import RoomForm from '../components/RoomForm';
import Loader from '../components/Loader';

const Home = () => {

    const [isFetching,setIsFetching] = useState(true);
    const {createRoom,getRooms} = useEdit();
    const navigate = useNavigate();
    const [rooms,setRooms] = useState([]);
    const [isOpen,setIsOpen] = useState(false)
    

    useEffect(()=>{
        const getAllRooms=async()=>{
            try {
                const rooms = await getRooms();
                setRooms(rooms);
            } catch (error) {
                //console.log(error.message)
                
            }finally{
                setIsFetching(false);
            }

        }

        getAllRooms();
    },[])

    const handleClick=async()=>{

        setIsOpen(!isOpen);

        /*
        try {
            
            const res = await createRoom();
            navigate(`/room/${res._id}/edit`);
        } catch (error) {
            console.log(error);
        }
        */
    }

    const openEditor=async(roomid)=>{
        try {
            const {data} = await axiosInstance.get(`/room/${roomid}`);
            navigate(`/room/${roomid}/edit`)
        } catch (error) {
            //console.log(error);
        }

    }


    if(isFetching){
        return <Loader/>
    }

    //console.log(rooms);


  return (
    <div className=''>

        <nav className='sticky flex rounded-b-md my-2 p-2 shadow-lg'>

            <h2 className='text-4xl'>Code<span className='text-blue-600'>IT</span></h2>

            <button onClick={handleClick} 
            className='ml-auto bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-600/80 active:bg-blue-600/70'>
                New Project
            </button>
        </nav>


        <main className='mx-4'>
            <div className='flex flex-col gap-2'>
                {rooms.length>0 ? rooms.map((room,idx)=>{
                    return <div key={room.roomId._id} 
                    className='flex flex-col gap-4 p-2 rounded-lg cursor-pointer bg-[#1F1F1F]' 
                    onClick={()=>openEditor(room.roomId._id)}>
                        <div>
                            <h2>{room.roomId.roomName}</h2>
                        </div>

                        <div>
                            <p className='text-[13px] text-zinc-500'>Language: <span>{room.roomId.language}</span></p>
                        </div>
                    </div>
                }):<span>Start Collaborating on Projects</span>}

            </div>
        </main>


        {isOpen && <div className={`${isOpen?"block":"hidden"} fixed inset-0 z-10 w-screen h-screen bg-black/30 backdrop-blur-sm`} onClick={()=>setIsOpen(false)}/>}


        {isOpen && <RoomForm/>}


    </div>
  )
}

export default Home
