import React from 'react'
import { useContext } from 'react'
import { Auth } from '../context/AuthContext'
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const useEdit = () => {

    const {authUser} = useContext(Auth);

    const createRoom=async(formData)=>{
        try {

            const {data} = await axiosInstance.post(`/room/new`,formData);
            return data
            
        } catch (error) {
            console.log(error.message);
            
        }
    }

    const joinRoom=async(roomid)=>{
        try {
            const {data} = await axiosInstance.post(`/room/join/${roomid}`);
            return data
            
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
            
        }
    }

    const getRooms=async()=>{
        try {
            const {data} = await axiosInstance.get("/room");
            return data
        } catch (error) {
            console.log(error.response.data.message || error.message);
        }
    }

    const getRoomMembers = async(roomid)=>{

        try {
            const {data} = await axiosInstance.get(`/room/mem/${roomid}`);
            return data
        } catch (error) {
            console.log(error.response.data.message || error.message);
            
        }
    }

    const updateRoomLanguage=async(roomid,language)=>{
        try {
           const {data} = await axiosInstance.put(`/room/edit/language/${roomid}`,{language});
           return data
        } catch (error) {
            console.log(error.response.data.message || error.message);
        }
    }

    

    return {createRoom,joinRoom,getRooms,getRoomMembers,updateRoomLanguage}
  
}

export default useEdit
