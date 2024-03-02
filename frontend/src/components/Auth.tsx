import { SignupInput } from '@aditimishra537/medium-common'
import  { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { BACKEND_URL } from "../config.ts"

const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        password: "",
        email: ""
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === 'signup' ? 'signup' : 'signin'}`, postInputs)
            const jwt = response.data.jwt;  
            if(jwt) {
                localStorage.setItem("token", jwt);
                navigate("/blogs");
            } else {
                navigate("/signin")
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='h-screen flex justify-center flex-col'>
        <div className='flex justify-center'>
            <div className='max-w-lg'>
                <div className='px-10'>
                    <div className='text-3xl font-extrabold'>
                        Create an Account
                    </div>
                    <div className=' text-slate-400 text-sm text-center mt-2'>
                        {type === 'signin' ? "Don't have an acount?" : "Already have an account? "}
                        <Link to={type === 'signin' ? "/signup" : "/signin"} className='underline pl-1'>
                            {type === 'signin' ? 'SignUp' : 'Login'}
                        </Link>
                    </div>
                </div>
                <div className='pt-4'>
                    {type === 'signup' ? <LabelledInput label="Username" placeholder='Enter your username' onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            name: e.target.value
                        }))
                    }}/> : null}
                    <LabelledInput label="Email" placeholder='m@example.com' onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            email: e.target.value
                        }))
                    }}/>
                    <LabelledInput label="Password" placeholder='' type= 'password' onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            password: e.target.value
                        }))
                    }}/>
                </div>
                
                <div className='flex justify-center items-center mt-4'>
                    <button onClick={ sendRequest} type='button' className="bg-black text-white px-4 py-2 rounded-md w-full">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
            
        
        </div>
        
        
    </div>
  )
}
interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: ( e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelledInput({label, placeholder, onChange, type} : LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-gray-900 font-semibold pt-2">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
    </div>
}

export default Auth