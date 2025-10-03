import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import bg from "../assets/authBg.png"
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverURL, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSignIn = async (e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      let result = await axios.post(`${serverURL}/api/auth/signin`, { email, password }, {withCredentials: true});
      setUserData(result.data);
      setLoading(false);
      navigate('/customize');
    } catch(error){
      setUserData(null);
      setLoading(false);
      setError(error.response.data.message);
    }
  }
  return (
    <div className='w-full h-[100vh] bg-cover bg-center flex items-center justify-center' style={{backgroundImage: `url(${bg})`}}>
        <form className='w-[90%] h-[600px] max-w-[500px] bg-[#0000006f] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] rounded' onSubmit={handleSignIn}>
            <h1 className='text-white text-[30px] font-semibold mb-[30px]'> Sign In to <span className='text-blue-400'>Virtual Assistant</span> </h1>
            <input type="email" placeholder='Email' className='w-[90%] h-[60px] rounded px-3 outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email}/>
            <div className='w-[90%] h-[60px] border-2 border-white bg-transparent text-white text-[18px] rounded-full relative'>
                <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-400 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password}/>
                {!showPassword && <IoIosEye className='absolute top-[18px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]' onClick={() => setShowPassword(true)} /> }
                {showPassword && <IoIosEyeOff className='absolute top-[18px] right-[20px] text-white cursor-pointer w-[25px] h-[25px]' onClick={() => setShowPassword(false)} /> }
            </div>
            {error.length>0 && <p className='text-red-500 text-[18px]'>*{error}</p>}
            <button className='min-w-[150px] h-[60px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full text-[18px] mt-[30px]' disabled={loading}> {loading ? "Signing In..." : "Sign In"} </button>
            <p className='text-white text-[18px] font-semibold cursor-pointer' onClick={() => navigate("/signup")}> Want to create an account? <span className='text-blue-400'> Sign Up </span> </p>
        </form>
    </div>
  )
}

export default SignIn
