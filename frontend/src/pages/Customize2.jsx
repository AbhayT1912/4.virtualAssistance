import { useState, useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoArrowBackCircleSharp } from "react-icons/io5";
function Customize2() {
  const navigate = useNavigate()
  const { userData, backend, selectedImage, setUserData, serverURL, setIsProfileComplete } =
    useContext(userDataContext)

  // ✅ match the backend key exactly: assistantName
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ''
  )

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData()
      formData.append('assistantName', assistantName) // ✅ FIXED key name
      if (backend) {
        formData.append('assistantImage', backend);
      } else if (selectedImage) {
        formData.append('imageUrl', selectedImage);
      }

      const result = await axios.post(
        `${serverURL}/api/user/update`,
        formData,
        { withCredentials: true }
      )

      console.log("Updated user:", result.data)

      // ✅ Use result.data.user (because backend returns { user: {...} })
      if (result.data.user) {
        setUserData(result.data.user)
        setIsProfileComplete(true)
      }

      navigate('/')
    } catch (err) {
      console.log("Error updating assistant:", err)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030345] flex justify-center items-center flex-col p-[20px] relative'>
      <IoArrowBackCircleSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate('/customize')}/>
      <h1 className='text-white text-[20px] lg:text-[40px] font-bold mb-[30px]'>
        Enter Your Assistant Name
      </h1>
      <input
        type='text'
        placeholder='Name'
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required
        value={assistantName}
        onChange={e => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className='min-w-[300px] h-[60px] mt-[30px] bg-[#0000ff74] text-white py-[10px] px-[20px] rounded-full hover:bg-[#0000ff] font-bold cursor-pointer'
          onClick={handleUpdateAssistant}
        >
          Finally Create your Assistant
        </button>
      )}
    </div>
  )
}

export default Customize2
