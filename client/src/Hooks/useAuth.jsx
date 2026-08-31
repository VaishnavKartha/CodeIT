import React from 'react'
import axiosInstance from '../lib/axios'
import {toast} from 'react-hot-toast';
import { useContext } from 'react';
import { Auth } from '../context/AuthContext';

const useAuth = () => {

    const {authUser,setAuthUser} = useContext(Auth);


  const login=async(formData)=>{
    try {

        const {data} = await axiosInstance.post("/auth/login",formData);
        console.log(data);
        setAuthUser(data);
        
    } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data.message);
        
    }
  }

  const signup=async(formData)=>{
    try {

        const {data} = await axiosInstance.post("/auth/signup",formData);
        console.log(data);
        setAuthUser(data);
        toast.success("User logged in successfully");
        
    } catch (error) {
        toast.error(error.response.data.message)   
    }
  }

  const getMe=async()=>{
    try {
        const {data} = await axiosInstance.get("/auth/me");
        return data
        
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }

  return { login, getMe , signup}
}

export default useAuth
