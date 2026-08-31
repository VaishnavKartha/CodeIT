import React, { useState } from 'react'
import { LANGUAGES } from '../lib/languages'
import useEdit from '../Hooks/useEdit';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const RoomForm = () => {

    const {createRoom} = useEdit();
    const [disable,setDisable] = useState(false);
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        roomName:`Untitled-${new Date().toLocaleDateString()}`,
        language:"javascript",
        isLinkShareable:true
    });

    const submitForm=async(e)=>{
        e.preventDefault();
        
        const {roomName,language,isLinkShareable} = formData;

        if(!roomName?.trim() || !language){
            toast.error("Please fill all form fields");
            return
        }

        try {
            setDisable(true);
            const res = await createRoom(formData);
            console.log(res)
            navigate(`/room/${res._id}/edit`);
            
        } catch (error) {
            
        }finally{
            setDisable(false);
        }
    }
   

    console.log(formData);
  return (
    <div className='z-20 rounded-md shadow-lg w-screen sm:w-[70%] mx-2 sm:mx-0 py-4 px-2 absolute top-[30%] left-[50%] transform translate-y-[-50%] translate-x-[-50%] bg-zinc-900'>
      <h1 className='text-3xl'>Create New Project</h1>

      <form className='mt-4 mb-2 px-2 flex flex-col gap-4' onSubmit={submitForm}>
        <div className='flex flex-col'>
            <label className='text-zinc-300'>Project Name</label>
            <input
            className='border border-zinc-500 outline-0 pl-1 py-2'
            type='text'
            value={formData?.roomName}
            onChange={(e)=>setFormData(prev=>({...prev,["roomName"]:e.target.value}))}
            placeholder='js-project'/>

        </div>

        <div className='flex flex-col'>
            <label className='text-zinc-300'>Select Language</label>
            <select 
            value={formData?.language}
            onChange={(e)=>setFormData(prev=>({...prev,["language"]:e.target.value}))}
                className='border border-zinc-500 pl-1 py-2'>
                {LANGUAGES.map((lang,idx)=>{
                    return <option key={idx} value={lang.lang}>{lang.lang}</option>
                })}
            </select>

        </div>

        <div className='flex flex-col'>
            <label className='text-zinc-300'>Room Access </label>
            <select 
            value={formData?.isLinkShareable ? 'public' :"private"}
            onChange={(e)=>setFormData(prev=>({...prev,["isLinkShareable"]:e.target.value.toLowerCase() === "public"}))}
                className='border border-zinc-500 pl-1 py-2'>
                <option value="private">Private</option>
                 <option value="public">Anyone with link</option>
            </select>

        </div>

        <button
            disabled={disable}
            className='ml-auto bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-600/80 active:bg-blue-600/70'>
                Create Project
        </button>
      </form>
    </div>
  )
}

export default RoomForm
