import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import api from "../services/api";
import { toast } from "sonner";

const Login = () => {

  const [state, setState] = useState('Login');
  const { setIsLoginOpen, backendURL, setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Login') {
        const { data } = await api.post("/api/users/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          toast.success('Logged in successfully!');
          setIsLoginOpen(false);
          console.log(data.user);
        } else {
          toast.error(data.message);
          console.log(data.message);
        }
      }
      else {
        const { data } = await api.post("/api/users/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          toast.success('Registered successfully!');
          setIsLoginOpen(false);
          console.log(data.user);
        } else {
          toast.error(data.message);
          console.log(data.message);
        }
      }
    } catch (error) {
      console.log("Error during form submission:", error);
      toast.error('Something went wrong. Please try again.');
    }
  };


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="relative bg-white p-8 md:p-10 rounded-xl text-slate-900 shadow-lg">
        <h1 className="text-center text-2xl text-neutral-900 font-medium">
          {state}
        </h1>
        <p className="text-sm text-center mb-4">
          Please enter your credentials to sign in.
        </p>

        {state !== 'Login' && <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
          <img width={20} src={assets.profile_icon} />
          <input
            type="text"
            className="outline-none text-sm w-full"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={20} src={assets.email_icon} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none text-sm w-full"
            placeholder="Email"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={20} src={assets.lock_icon} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none text-sm w-full"
            placeholder="Password"
            required
          />
        </div>
        <p className="text-sm text-right text-blue-600 cursor-pointer">Forgot Password?</p>

        <button className="w-full bg-blue-600 text-white py-2 rounded-full mt-6 hover:bg-blue-700 transition-colors">
          {state === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>

        {state === 'Login' ? <p className="text-sm text-center mt-4">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>Sign Up</span>
        </p> : <p className="text-sm text-center mt-4">
          Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>Login</span>
        </p>}

        <img src={assets.cross_icon} onClick={() => setIsLoginOpen(false)} className="absolute top-5 right-5 cursor-pointer" />
      </motion.form>
    </motion.div>
  );
};

export default Login;