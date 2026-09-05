import { useState } from "react";
import LanguageSelector from "./LanguageSelector";

const RoomSettings = ({ roomInfo, changeStatus, changeRoomPermission, activeLanguage, setActiveLanguage }) => {
    const [manageOptions, setManageOptions] = useState({ permission: false, language: false });

    const isPublic = roomInfo?.roomId?.isLinkSharingEnables;
    console.log(isPublic);

    return (
        <div className='cursor-pointer bg-zinc-900 z-10 absolute min-h-25 top-full right-1/2 transform translate-y-2 translate-x-[50%] min-w-[25vw] text-center flex flex-col justify-evenly'>
            {roomInfo?.role === "owner" && <div className='hover:bg-zinc-600/20 p-2 relative'>
                <button onClick={() => setManageOptions(prev => ({ ...prev, permission: !prev.permission, language: false }))}
                    className="w-full">
                    Permission
                </button>
                {manageOptions.permission && (
                    <div className='min-h-25 absolute right-full transform -translate-x-1.5 top-[70%] bg-zinc-900 min-w-[25vw]
                    flex flex-col justify-between cursor-pointer'>
                       
                        <span onClick={()=>{changeRoomPermission(true);setManageOptions(prev=>({...prev,permission:false}))}}
                            className={`${isPublic && "bg-blue-500/20"} rounded-md py-2`}>Public</span>
                        <span onClick={()=>{changeRoomPermission(true);setManageOptions(prev=>({...prev,language:false}))}}
                            className={`${!isPublic && "bg-blue-500/30"} rounded-md py-2`}>Private</span>
                    </div>
                )}
            </div>}

            <div className='hover:bg-zinc-600/20 p-2 relative'>
                <button onClick={() => setManageOptions(prev => ({ ...prev, language: !prev.language, permission: false }))}
                    className="w-full">
                    Languages
                </button>
                {manageOptions.language && (
                    <div className='absolute right-full transform -translate-x-1.5 top-[70%]'>
                      
                        <LanguageSelector activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomSettings;