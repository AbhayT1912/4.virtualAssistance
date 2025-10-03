import { useRef, useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import Card from '../components/card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { LuImagePlus } from "react-icons/lu"
import { useNavigate } from 'react-router-dom'
import { IoArrowBackCircleSharp } from "react-icons/io5";

function Customize() {
  const {
    frontend,
    setFrontend,
    backend,
    setBackend,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext)

  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = e => {
    const file = e.target.files[0]
    if (file) {
      setBackend(file)
      setFrontend(URL.createObjectURL(file))
      setSelectedImage("input")
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030345] flex justify-center items-center flex-col p-[20px] relative'>
      <IoArrowBackCircleSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate('/signin')}/>
      <h1 className='text-white text-[20px] lg:text-[40px] font-bold mb-[30px]'>
        Select Image of your Assistant
      </h1>

      <div className='w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
        {[image1, image2, image3, image4, image5, image6, image7].map((img, idx) => (
          <Card key={idx} image={img} />
        ))}

        {/* Upload Card */}
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#02022b] border-2 border-[#0000ff74] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${
            selectedImage === "input" ? 'border-4 border-white shadow-2xl shadow-blue-950' : ''
          }`}
          onClick={() => inputImage.current.click()}
        >
          {!frontend && <LuImagePlus className='w-[25px] h-[25px] text-white' />}
          {frontend && <img src={frontend} className='w-full h-full object-cover' />}
        </div>

        <input
          type='file'
          accept='image/*'
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          className='mt-[30px] bg-[#0000ff74] text-white py-[10px] px-[20px] rounded-full hover:bg-[#0000ff] font-bold cursor-pointer'
          onClick={() => navigate('/customize2')}
        >
          Confirm Selection
        </button>
      )}
    </div>
  )
}

export default Customize
