import React, { useRef } from 'react'
import CollabEditor from '../components/CollabEditor'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import useEdit from '../Hooks/useEdit';
import toast from 'react-hot-toast';
import { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import ViewCollaborators from '../components/ViewCollaborators';
import { useContext } from 'react';
import { Room } from '../context/RoomContext';
import Loader from '../components/Loader';
import useRun from '../Hooks/useRun';
import Output from '../components/Output';

const Code = () => {

    const [joinStatus,setJoinStatus] = useState("joining");
    const {roomid} = useParams();
    const {joinRoom,getRoomMembers, updateRoomLanguage} = useEdit();
    const navigate = useNavigate();
    const [roomMembers,setRoomMembers] = useState([]);
    const [roomInfo,setRoomInfo] = useState(null);
    const {runCode} = useRun();
    const [isExecuting,setIsExecuting] = useState(false);
    const [someoneElseRunning,setSomeoneElseRunning] = useState(false);
    const [execResult,setExecResult] = useState({});

    //const [isRunButtonActive,setIsRunButtonActive] = useState(true);
    const ydocRef = useRef(null)

   useEffect(() => {
    const doJoin = async () => {
        
        const res = await joinRoom(roomid);
        
        if (res) {
            toast.success("You are now a collaborator");
            setJoinStatus("success");
            setRoomInfo(res);
            //console.log(res);



            const members = await getRoomMembers(roomid);
            //console.log(members)
            setRoomMembers(members);


        }else{
            setJoinStatus("denied");
            setRoomInfo(null);

        }
        
    };
    doJoin();
}, [roomid]);


    const updateEditorLanguage = async(language)=>{
        if(language.lang.toLowerCase() === roomInfo?.roomId?.language.toLowerCase()) return

        //console.log(language.lang);

        // update room language logic.....

        const previousLanguage = roomInfo.roomId.language;
        setRoomInfo(prev=>({...prev,roomId:{...prev.roomId,language:language.lang}}))
        ydocRef.current.getMap('language').set('language', language.lang);
        try {
            
            const res = await updateRoomLanguage(roomid,language.lang);

            if(!res){
                setRoomInfo(prev=>({...prev,roomId:{...prev.roomId,language:previousLanguage}}));

            }
        } catch (error) {
            setRoomInfo(prev=>({...prev,roomId:{...prev.roomId,language:previousLanguage}}));
            return
        }



    }


    const handleCodeExecution=async()=>{
        const language = roomInfo.roomId.language;
        const code = ydocRef?.current?.getText('editor').toString();
        if(!language?.trim() ) return

        if(!code?.trim()) return toast.error("Editor empty!!!",{duration:1000});
        try {
            setIsExecuting(true);
            const res = await runCode(roomid,{language,code});
            //console.log(res);
            //setExecResult(res);
            ydocRef.current.getMap('execution').set('execution',res)
            
        } catch (error) {
            //console.log(error);
        }finally{
            setIsExecuting(false);
        }

    }



    if(joinStatus === "joining"){
        return <Loader/>
    }

    if(joinStatus === "denied"){
        navigate("/");
        return
    }
    
  return (
    <div className=''>
        <div className='flex justify-end gap-2 md:gap-12 py-2  '>
            <div className='max-sm:hidden flex md:mx-auto'>

                <LanguageSelector activeLanguage={roomInfo?.roomId?.language} setActiveLanguage={updateEditorLanguage}/>


            </div>

            <div className='flex gap-2 md:gap-12'>

                <div className='mt-auto'>
                    <button
                        disabled={isExecuting || someoneElseRunning}
                        onClick={handleCodeExecution}
                        className=' max-md:text-[12px] bg-blue-600 p-1 md:p-2 rounded-lg cursor-pointer hover:bg-blue-600/80 active:bg-blue-600/70'>
                            { (isExecuting || someoneElseRunning) ? <span className='w-8 h-8 border-2 border-white border-b-blue-500  rounded-full animate-spin'></span> : <span>Run Code</span>}
                    </button>
                </div>
                <ViewCollaborators roomMembers={roomMembers}/>
            </div>


        </div>
        <div className='relative grid grid-cols-1 md:grid-cols-2 h-screen md:h-[90vh]'>


            <div className='absolute top-0 transform -translate-y-full left-0 bg-[#1E1E1E] p-2'>
                {roomInfo && <h3 className='text-[12px] md:text-sm'>{roomInfo?.roomId?.roomName}</h3>}
            </div>


            <CollabEditor 
                activeLanguage={roomInfo?.roomId?.language} 
                onDocReady={(ydoc) => { ydocRef.current = ydoc; }} 
                running={isExecuting}
                setSomeoneElseRunning={setSomeoneElseRunning}
                setExecResult={setExecResult}
            />

            <Output output={execResult}/>

        </div>

    </div>
  )
}

export default Code
