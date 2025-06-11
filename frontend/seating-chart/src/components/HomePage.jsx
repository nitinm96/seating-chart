import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import testData from '../testData/guestData.json'
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PasswordModal from './PasswordModal';

function HomePage() {

  const navigate = useNavigate();
  const [allGuestData, setAllGuestData] = useState([])
  const [searchedGuest, setSearchedGuest] = useState("")
  const [searchedOutput, setSearchedOutput] = useState([])
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getAllSeating = async () =>{
    try {
      setError(false);
      setErrorMessage("");

      const response = await axios.get('http://localhost:5001/api/guests');
      console.log(response)
      const data = response.data.allGuests
      setAllGuestData(data);

    } catch (error) {
      console.error(error);
      const errMsg = error?.message || "Something went wrong. Please try again.";
      setError(true);
      setErrorMessage(errMsg);
    }
  }

  function findGuest(e){
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    const search = searchedGuest.toLowerCase().trim();
    const results = allGuestData.filter(guest => guest.guest_name.toLowerCase().includes(search));
    // const results = testData.filter(guest => guest.fullName.toLowerCase().includes(search));

    if(results.length == 0){
      setError(true);
      setErrorMessage("No guests found");
    }
    setSearchedOutput(results);
    }

  useEffect(() =>{
      getAllSeating()
  },[])
  
  const openPasswordModal = () =>{
    setShowPasswordModal(!showPasswordModal);
  }
  const closePasswordModal = () =>{
    setShowPasswordModal(!showPasswordModal);
  }
  const goToAdmin = () =>{
    navigate("/admin")
  }
  return (
    <div className="flex flex-col justify-center items-center">
        <div onClick={openPasswordModal} className='flex justify-end w-full justify-items-center'>
          {showPasswordModal && <PasswordModal goToAdmin={goToAdmin} closeModal={closePasswordModal} />}
          <div className="flex justify-center items-center bg-gray-500 text-white py-2 px-4 m-2 rounded-2xl cursor-pointer">
            <BuildCircleIcon />
            <span>Admin</span>
          </div>
        </div>
        
        <div className='text-3xl my-10'>
            LAVANYA & NITIN
        </div>
        <div className='flex flex-col justify-center items-center bg-black/15 p-8 rounded-2xl mb-10'>
            <div className='text-xl text-justify'>
                Please enter first and last name to find table number below:
            </div>
            <form method= "post" onSubmit={findGuest}>
              <input 
                className='bg-white mt-6 border border-black pl-3 py-2 rounded w-4/5' 
                type="text"
                name="fullName"     
                required
                minLength={4}
                placeholder='Enter first and last name' 
                autoFocus 
                onChange={(e) => setSearchedGuest(e.target.value)}
              />
              <button className='cursor-pointer py-2 px-8 mt-6 hover:opacity-90 bg-blue-400 rounded text-white' type='submit'>Find Table</button>
            </form>            
        </div>

        {/* display searched items */}
        {searchedOutput.length != 0 &&
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 mb-10">
          <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900">Guest Name</h5>
              <div className="font-bold">
                  Table Number
              </div>
          </div>
          <div className="">
                <ul role="list" className="divide-y divide-gray-200 ">
                    {searchedOutput.map((guest,index) =>
                      <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 ms-1">
                          <p className="text-md text-gray-900">
                            {/* {guest.fullName} */}
                            {guest.guest_name}
                          </p>
                        </div>                      
                        <div className="w-20 flex items-center justify-center text-base font-semibold text-gray-800">
                          <p className="text-md text-gray-900">
                            {/* {guest.fullName} */}
                            {guest.table_number}
                          </p>
                        </div>                      
                      </div>
                    </li>                    
                    )}                    
                </ul>
          </div>
        </div>
        }
        {error && <div className='text-md font-normal'>{errorMessage}</div>}
    </div>    
  )
}

export default HomePage