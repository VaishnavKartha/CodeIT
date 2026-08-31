import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
export const Room = createContext();
const RoomContext = ({children}) => {
    const [onlineMembers,setOnlineMembers] = useState([]);
  return (
    <Room.Provider value={{onlineMembers,setOnlineMembers}}>{children}</Room.Provider>
  )
}

export default RoomContext
