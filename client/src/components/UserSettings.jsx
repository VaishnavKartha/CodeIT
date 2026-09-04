import React from 'react'
import { useContext } from 'react'
import { Auth } from '../context/AuthContext'
import { useState } from 'react';
import { Eye, EyeClosed, Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { useRef } from 'react';
import useAuth from '../Hooks/useAuth';
import toast from 'react-hot-toast';

const UserSettings = () => {
    const {authUser,setAuthUser}= useContext(Auth);
    const [isUsernameDisabled,setIsUsernameDisabled] = useState(true);
    const inputRef = useRef(null);
    const [newUsername,setNewUsername] = useState(authUser?.username || "");
    const [newPassword,setNewPassword] = useState("");
    const {isPasswordLogin,resetPassword,updateProfile} = useAuth();
    const [isPassword,setIsPassword] = useState(null);
    const [showPassword,setShowPassword] = useState(false);
    const [buttonDisabled,setButtonDisabled] = useState(false);

    useEffect(()=>{
        if(isUsernameDisabled) return
        inputRef?.current.focus();
    },[isUsernameDisabled])

    useEffect(()=>{
        const checkLoginMethod=async()=>{
            const res = await isPasswordLogin();
            setIsPassword(res?.message);

        }

        checkLoginMethod();
    },[])

    const saveChanges=async()=>{

        try {
            setButtonDisabled(true);
            if(newUsername?.trim() !== authUser?.username){
                const res = await updateProfile(newUsername);
                toast.success(res?.message,{duration:1000});
                setAuthUser(prev=>({...prev,username:newUsername.trim()}));
            }

            if(newPassword?.trim()){
                const res = await resetPassword(newPassword);
                toast.success(res?.message,{duration:1000});
            }
        } catch (error) {
            console.log(error);
        }finally{
            setButtonDisabled(false);
        }
    }
  return (
    <div className='w-full h-full'>
        <main className='max-md:h-full flex flex-col gap-4 p-2 md:px-20 md:py-20 bg-[#181818] rounded-lg'>
            <div className='flex flex-col'>
                <label>
                    Username
                </label>
                
                <div className='relative w-full flex gap-2 items-center'>

                    <input
                    className='flex-1 outline outline-zinc-700 text-zinc-400 focus:text-white focus:outline-blue-500 p-2'
                    ref={inputRef}
                    type='text'
                    disabled={isUsernameDisabled}
                    value={newUsername}
                    onChange={(e)=>setNewUsername(e.target.value)}/>

                    <span className='z-10 absolute right-0 transform -translate-x-2 cursor-pointer' onClick={()=>setIsUsernameDisabled(!isUsernameDisabled)}><Pencil size={"20px"}/></span>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <label>Email</label>
                <input
                disabled
                className='outline outline-zinc-700 text-zinc-400 focus:text-white focus:outline-blue-500 p-2'
                value={authUser?.email}
                />
            </div>

            <div className='flex flex-col gap-2'>
                <label>
                    {isPassword ? "Reset Password" : "Set Password"}
                </label>

                <div className='flex relative'>

                    <input
                    className='flex-1 outline outline-zinc-700 text-zinc-400 focus:text-white focus:outline-blue-500 p-2'
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    type={showPassword? 'text':'password'}
                    placeholder='New password'/>

                    <span className='absolute right-0 transform -translate-x-1 top-1/2 translate-y-[-50%]' onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeClosed/> :<Eye/>}</span>
                </div>
            </div>

            <div>
                <button 
                disabled={buttonDisabled}
                onClick={saveChanges}
                className='bg-blue-600 rounded-md p-2 cursor-pointer hover:bg-blue-600/80'>Save Changes</button>

            </div>
        </main>
    </div>
  )
}

export default UserSettings


