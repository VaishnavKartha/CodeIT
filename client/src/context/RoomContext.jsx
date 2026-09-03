import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
export const Room = createContext();
const RoomContext = ({children}) => {
    const [onlineMembers,setOnlineMembers] = useState([]);
    const [liveLanguage,setLiveLanguage] = useState(null);
  return (
    <Room.Provider value={{onlineMembers,setOnlineMembers,liveLanguage,setLiveLanguage}}>{children}</Room.Provider>
  )
}

export default RoomContext
