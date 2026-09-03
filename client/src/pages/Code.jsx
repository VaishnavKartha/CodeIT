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

const Code = () => {

    const [joinStatus,setJoinStatus] = useState("joining");
    const {roomid} = useParams();
    const {joinRoom,getRoomMembers, updateRoomLanguage} = useEdit();
    const navigate = useNavigate();
    const [roomMembers,setRoomMembers] = useState([]);
    const [roomInfo,setRoomInfo] = useState(null);
    const ydocRef = useRef(null)

   useEffect(() => {
    const doJoin = async () => {
        
        const res = await joinRoom(roomid);
        
        if (res) {
            toast.success("You are now a collaborator");
            setJoinStatus("success");
            setRoomInfo(res);
            console.log(res);



            const members = await getRoomMembers(roomid);
            console.log(members)
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

        console.log(language.lang);

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

    if(joinStatus === "joining"){
        return <Loader/>
    }

    if(joinStatus === "denied"){
        navigate("/");
        return
    }
    
  return (
    <div>
        <div className='flex justify-between'>

            <div className='mt-auto bg-[#1E1E1E] p-2'>
                {roomInfo && <h3 className='text-sm'>{roomInfo?.roomId?.roomName}</h3>}
            </div>


            <LanguageSelector activeLanguage={roomInfo?.roomId?.language} setActiveLanguage={updateEditorLanguage}/>

            <ViewCollaborators roomMembers={roomMembers}/>

        </div>
        <CollabEditor activeLanguage={roomInfo?.roomId?.language} onDocReady={(ydoc) => { ydocRef.current = ydoc; }}/>

    </div>
  )
}

export default Code
