import React from 'react'
import axiosInstance from '../lib/axios'

const useRun = () => {

    const runCode=async(roomid,codeData)=>{
        try {
            const {data} = await axiosInstance.post(`/run/${roomid}`,codeData);
            return data;
        } catch (error) {
            console.log(error.response.data.message || error.message);
        }

    }

    return {runCode}
 
}

export default useRun
