import React, { useState } from 'react'

function PasswordModal({goToAdmin, closeModal}) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const validateAdmin = () => {
        if (password === import.meta.env.VITE_ADMIN_PASS){
            setError(false);
            goToAdmin();
            return
        }
        setError(true);
    }
  return (
    <div className='fixed inset-0 bg-black/70 flex justify-center items-center z-50' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5'>
            <div className="">
                <div className='mb-3'>
                    <label className="block mb-2 font-bold">Password</label>
                    <input 
                        className={error ? "bg-gray-50 border-2 border-red-500 text-gray-900 text-sm rounded-lg block w-full p-2.5" : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"}
                        type="password"  
                        placeholder="Enter password" 
                        required
                        autoFocus                        
                        onChange={(e) => setPassword(e.target.value)}
                    /> 
                </div>
            </div>
            {error && <span className='text-sm text-red-400'>Incorrect password</span>}
            <div className='flex justify-center items-center gap-x-6'>
                <button type="button" onClick={validateAdmin} className=" text-white bg-blue-500 border-blue-500 border-2 rounded-lg px-8 py-2">Enter</button>
                <button type="button" className="border-blue-500 border-2 rounded-lg px-8 py-2" onClick={closeModal}>Cancel</button>
            </div>            
        </div>
    </div>
  )
}

export default PasswordModal