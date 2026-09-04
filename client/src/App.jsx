import {useEffect,useContext} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Route, Router, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Home from './pages/Home';
import { Auth } from './context/AuthContext';
import useAuth from './Hooks/useAuth';
import Code from './pages/Code';
import { useState } from 'react';
import Loader from './components/Loader';
import Settings from './pages/Settings';

function App() {

  const {authUser,setAuthUser} = useContext(Auth);
  const [checkingAuth,setCheckingAuth] = useState(true);
  const {getMe} = useAuth();
  useEffect(()=>{

    const getAuthUser = async()=>{
      try {
        
        const data = await getMe();
        setAuthUser(data);
        console.log(data)
      } catch (error) {
        //console.log(error.message);
      }finally{
        setCheckingAuth(false);
      }

    }

    getAuthUser();

  },[])

  if(checkingAuth){
    return <Loader/>
  }


  return (
    <>
    <Toaster />
    

    <Routes>
      <Route path='/' element={authUser?<Home/>: <Navigate to="/login" />}/>
      <Route path='/login' element={!authUser?<Login/>:<Navigate to="/" />}/>
      <Route path='/signup' element={!authUser?<Signup/>: <Navigate to="/"/>} />
      <Route path='/settings' element={authUser ? <Settings/> : <Navigate to="/login"/>}/>
      <Route path='/room/:roomid/edit' element={authUser?<Code/>:<Navigate to="/login"/>} />
    </Routes>
    </>
  )
}

export default App
