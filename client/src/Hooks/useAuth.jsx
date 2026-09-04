import React from 'react'
import axiosInstance from '../lib/axios'
import {toast} from 'react-hot-toast';
import { useContext } from 'react';
import { Auth } from '../context/AuthContext';
import { useState } from 'react';
import { UserRoundArrowLeft } from 'lucide-react';

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

  const logout=async()=>{
    try {
        const {data} = await axiosInstance.get("/auth/logout");
        return data
    } catch (error) {
        toast.error(error.response.data.message || error.message,{duration:1000});
    }
  }

  const isPasswordLogin=async()=>{
    try {
        const {data} =await axiosInstance.get("/auth/password");
        return data;
    } catch (error) {
        toast.error(error.response.data.message || error.message);
    }
  }

  const updateProfile=async(username)=>{
    try {
        const {data} = await axiosInstance.patch("/auth/profile",{username});
        return data;
    } catch (error) {
        toast.error(error.response.data.message || error.message);
    }
  }

  const resetPassword=async(password)=>{
    try {
        const {data} = await axiosInstance.patch("/auth/password",{password});
        console.log(data);
        return data;
    } catch (error) {
        toast.error(error.response.data.message || error.message);
    }

  }

  return { login, getMe , signup,logout,isPasswordLogin,updateProfile,resetPassword}
}

export default useAuth
