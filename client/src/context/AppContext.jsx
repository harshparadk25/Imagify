import {createContext, useState} from 'react';
import {toast} from 'sonner';
export const AppContext = createContext();
import api, { warmUpBackend } from '../services/api';
import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContextProvider = (props) =>{
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate();
    const backendReady = useRef(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    // Warm up backend on first mount
    useEffect(() => {
        warmUpBackend().then((ok) => {
            backendReady.current = true;
            if (!ok) console.warn('Backend warm-up failed — requests may be slow');
        });
    }, []);

    const loadCreditsData = useCallback(async ()=>{
        try {
            const {data} = await api.get("/api/users/credits");
            if(data.success){   
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error loading credits data:", error);
            // Only show toast for non-network errors (avoid spamming on cold-start)
            if (error.response) {
                toast.error('Failed to load credits data.');
            }
        }
    }, []);

    const generateImage = async (prompt)=>{
        try {
            const {data} = await api.post("/api/images/generate-image", {
                prompt
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

    useEffect(() => {
  if (token) {
    loadCreditsData();
  } else {
    setUser(null);
  }
}, [token, loadCreditsData]);


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