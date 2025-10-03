import React, { createContext, useEffect, useState}from 'react'
export const userDataContext = createContext();
import axios from 'axios';
function UserContext({children}) {
    const serverURL = "http://localhost:8000";
    const [userData, setUserData] = useState(null);
    const [frontend, setFrontend] = useState(null)
    const [backend, setBackend] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const handleCurrentUser = async ()=>{
        try {
            const response = await axios.get(`${serverURL}/api/user/current`, {withCredentials: true});
            setUserData(response.data.user);
            if (response.data.user.assistantImage && response.data.user.assistantName) {
                setIsProfileComplete(true);
            }
            console.log(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverURL}/api/user/asktoassistant`, { command }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(()=>{
        handleCurrentUser();
    },[]);
    const logout = async () => {
        try {
            await axios.post(`${serverURL}/api/auth/logout`, {}, { withCredentials: true });
            setUserData(null);
            setIsProfileComplete(false);
        } catch (error) {
            console.log(error);
        }
    };

    const value = { serverURL, userData, setUserData, frontend, setFrontend, backend, setBackend, selectedImage, setSelectedImage, loading, logout, isProfileComplete, setIsProfileComplete, getGeminiResponse }; // Add any values you want to provide to the context here
  return (
    <div>
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
