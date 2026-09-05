import React from 'react'
import useAuth from '../Hooks/useAuth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Auth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import UserSettings from '../components/UserSettings';
import RoomSettings from '../components/RoomSettings';
import { Menu, XIcon } from 'lucide-react';

const Settings = () => {
    const {logout} = useAuth();
    const [isDisabled,setIsDisabled] = useState(false);
    const navigate = useNavigate();
    const {setAuthUser} = useContext(Auth);
    const [selected,setSelected] = useState(true);
    const [isOpen,setIsOpen] = useState(false);


    const handleLogout=async()=>{
        try {
            setIsDisabled(true);
            const res = await logout();
            setAuthUser(null);
            navigate("/login");
            toast.success(res.message,{duration:1000});
        } catch (error) {
            
        }finally{
            setIsDisabled(false);
        }


    }
  return (
    
    <div className='relative flex min-h-screen'>

        {!isOpen && <div  
            onClick={()=>setIsOpen(!isOpen)}
            className='md:hidden fixed left-0 z-10 cursor-pointer'>
                <Menu/>
        </div>}

        <aside 
            className={`max-md:z-20 bg-[#181818] md:bg-transparent fixed left-0 md:relative h-screen 
            transform ${isOpen?"max-md:translate-x-0" : "max-md:-translate-x-full"} 
             w-[70vw] md:w-[30vw] lg:w-[20vw] flex flex-col justify-between 
            transition-transform ease-in-out duration-300 rounded-r-lg shadow-lg`}>

            {isOpen && <span className='absolute right-0 md:hidden' onClick={()=>setIsOpen(!isOpen)}>
                <XIcon/>
            </span>}
            
            <div className='text-center'>
                <h1 className='text-3xl py-2'>Settings</h1>
                <hr/>
            </div>


            <div className='flex flex-col text-center px-2'>
                <button onClick={()=>setSelected(true)} className={` py-2 text-lg cursor-pointer rounded-md ${selected && "bg-blue-900/40 border-l-4 border-l-blue-500"}`}>User</button>
               { /* <button onClick={()=>setSelected(false)} className={` py-2 text-lg cursor-pointer rounded-md ${!selected && "bg-blue-900/40 border-l-4 border-l-blue-500"}`}>Rooms</button>*/ }
            </div>

            <div className=''>
                
                <button 
                disabled={isDisabled}
                onClick={handleLogout}
                className='bg-red-600 w-full py-2 hover:bg-red-600/80 cursor-pointer'>Logout</button>
            </div>

        </aside>

        <main className='flex-1 bg-zinc-800 py-20 md:p-12 md:py-4'>
            {selected === true && <UserSettings/>}
        </main>
    </div>
    
  )
}

export default Settings
