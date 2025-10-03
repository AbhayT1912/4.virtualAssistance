import React, { useContext, useEffect, useState, useRef } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'



function Home () {
  const { logout, getGeminiResponse } = useContext(userDataContext)
  const { userData } = useContext(userDataContext)
  const [assistantResponse, setAssistantResponse] = useState('')
  const [userText, setUserText] = useState('')
  const [aiText, setAiText] = useState('')
  const [listening, setListening] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis
  const navigate = useNavigate()
  
  const startRecognition = () =>{
    try{
      recognitionRef.current?.start();
      setListening(true);
    } catch(error){
      if(!error.message.includes("start")){
        console.log("recognition error:", error);
      }
    }
  }


  const speak = text => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN')
    if (hindiVoice) {
      utterance.voice = hindiVoice
    }
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1
    isSpeakingRef.current = true
    utterance.onend = () => {
      isSpeakingRef.current = false
      startRecognition()
    }
    synth.speak(utterance)
  }

  const handleCommand = data => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput)
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        '_blank'
      )
    }
    if (type === 'calculator-open') {
      window.open(
        'https://www.online-calculator.com/full-screen-calculator/',
        '_blank'
      )
    }
    if (type === 'instagram-open') {
      window.open('https://www.instagram.com/', '_blank')
    }
    if (type === 'facebook-open') {
      window.open('https://www.facebook.com/', '_blank')
    }
    if (type === 'weather-show') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true

    recognitionRef.current = recognition

    const isRecognizingRef = { current: false }

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log('Recognition started')
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.log('Recognition error:', error)
          }
        }
      }
    }

    recognition.onstart = () => {
      console.log(
        'Voice recognition activated. Try speaking into the microphone.'
      )
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      console.log('Voice recognition turned off.')
      isRecognizingRef.current = false
      setListening(false)

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition()
        }, 1000)
      }
    }

    recognition.onerror = event => {
      console.warn('Recognition error:', event.error)
      isRecognizingRef.current = false
      setListening(false)
      if(event.error !== 'aborted' && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition()
        }, 1000)
      }
    }

    recognition.onresult = async event => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim()
      console.log('heard: ' + transcript)
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        if (data && data.response) {
          setAssistantResponse(data.response)
          console.log('response: ', data)
          handleCommand(data)
        }
      }
    }
    const fallbackInterval = setInterval(() => {
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    }, 10000)
    safeRecognition()
    return () => {
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      clearInterval(fallbackInterval)
    }
  }, [])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#01012e] flex flex-col justify-center items-center relative'>
      <button
        className='min-w-[80px] h-[40px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full text-[18px] mt-[10px] absolute top-0 right-0 px-4 py-2 m-2 cursor-pointer'
        onClick={logout}
      >
        Logout
      </button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden'>
        <img
          src={userData?.assistantImage}
          alt=''
          className='h-full object-cover rounded-full mt-[100px] shadow-lg shadow-black'
        />
      </div>
      <div className='w-full flex justify-center items-center flex-col mt-[20px]'>
        <h1 className='text-white text-[30px] font-bold mb-[10px]'>
          Welcome, {userData?.name}!
        </h1>
        <h1 className='text-white text-[30px] font-bold mb-[10px]'>
          I'm {userData?.assistantName}
        </h1>
        <p className='text-white text-[18px]'>
          Your virtual assistant, ready to help you.
        </p>
        {!aiText && <img src={userImg} alt='' className='w-[200px]' />}
        {aiText && <img src={aiImg} alt='' className='w-[200px]' />}
        {assistantResponse && (
          <p className='text-white text-[18px] mt-4'>{assistantResponse}</p>
        )}

      </div>
    </div>
  )
}

export default Home
