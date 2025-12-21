import {createContext, useState} from 'react';
import {toast} from 'sonner';
export const AppContext = createContext();
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContextProvider = (props) =>{
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate();

    const backendURL =  import.meta.env.PRODUCTION || 'http://localhost:3000';

    const loadCreditsData = async ()=>{
        try {
            const {data} =await axios.get(`${backendURL}/api/users/credits`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(data.success){   
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error loading credits data:", error);
            toast.error('Failed to load credits data.');
        }
    }

    const generateImage = async (prompt)=>{
        try {
            const {data} = await axios.post(`${backendURL}/api/images/generate-image`, {
                prompt
            },{
                headers: {  
                    'Authorization': `Bearer ${token}`
                }
            });
            if(data.success){
                loadCreditsData();
                toast.success('Image generated successfully!');
                return data.image;
            }else{
                toast.error(data.message);
                loadCreditsData();
                if(data.creditsLeft ===0){
                    navigate('/buy-credits');
                }
            }
        } catch (error) {
            console.error("Error generating image:", error);
            toast.error('Failed to generate image.');
        }
    }

    const Logout = () =>{
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
    }

    useEffect(()=>{
        if(token){
            loadCreditsData();
        }
    },[token]);

    const value = {
        user,
        setUser,
        isLoginOpen,
        setIsLoginOpen,
        backendURL,
        token,
        setToken,
        loadCreditsData,
        Logout,
        generateImage
    }
    return(
            <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;