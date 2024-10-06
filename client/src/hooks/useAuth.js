import axios from 'axios';
import {useState} from 'react'

function useAuth(){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const signUp = async (userData)=>{
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/register', userData);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err.response ? err.response.data.message : err.message);
            throw err;
        }
    }

    const getOtp = async (email) =>{
        setLoading(true);
        try{
            const res = await axios.post('http://localhost:5000/auth/get-otp', email);
            setLoading(false);
            return res.data;
        }catch(err){
            setLoading(false);
            setError(err.response ? err.response.data.message : err.message);
            throw err;
        }
    }

    const verifyOtp = async (payload) =>{
        setLoading(true);
        try{
            const res = await axios.post('http://localhost:5000/auth/verify-otp',payload);
            setLoading(false);
            if(res.status===200){
                console.log("Successfully");
            }
            if(res.status ===400){
                console.log("Incorrect");
            }
        }catch(err){
            setLoading(false);
            console.log(err);
        }
    }

    return { signUp, loading, error, getOtp, verifyOtp };
}

export default useAuth;