import { useContext } from 'react'
import { userDataContext } from '../context/userContext'

function Card({ image }) {
  const {
    selectedImage,
    setSelectedImage,
    setFrontend,
    setBackend
  } = useContext(userDataContext)

  const handleSelect = () => {
    setSelectedImage(image)
    setFrontend(null)
    setBackend(null)
  }

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#02022b] border-2 border-[#0000ff74] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage === image ? 'border-4 border-white shadow-2xl shadow-blue-950' : ''
      }`}
      onClick={handleSelect}
    >
      <img src={image} className='w-full h-full object-cover rounded-2xl' />
    </div>
  )
}

export default Card
