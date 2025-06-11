import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import GuestCard from './GuestCard';
import testData from '../testData/guestData.json'
import AddGuestModal from './AddGuestModal';

function AdminPage() {

    const navigate = useNavigate();
    const [allGuestData, setAllGuestData] = useState([]);
    const [searchedItem, setSearchedItem] = useState("");
    const [searchedOutput, setSearchedOutput] = useState([]);
    const [viewAllGuests, setViewAllGuests] = useState(true);
    const [showAddGuestModal, setShowAddGuestModal] = useState(false);
    
    const getAllGuests = async () =>{
      try {
        const response = await axios.get('http://localhost:5001/api/guests');
        console.log(response)
        setAllGuestData(response.data.allGuests);
      } catch (err) {
        console.error(err);
      }
    }

    function findGuest(e) {
      const search = e.trim().toLowerCase();
      setSearchedItem(search);

      // Show all guests if search is too short
      if (search.length < 1) {
        setViewAllGuests(true);
        setSearchedOutput([]);
        return;
      }
    
      setViewAllGuests(false);

      const results = allGuestData.filter((guest) => {
        const nameMatch = guest.guest_name.toLowerCase().includes(search);
        const tableMatch = guest.table_number.toString()===(search);
        return nameMatch || tableMatch;
      });

      //using test data
      // const results = testData.filter((guest) => {
      //   const nameMatch = guest.fullName.toLowerCase().includes(search);
      //   const tableMatch = guest.tableNumber.toString()===(search);
      //   return nameMatch || tableMatch;
      // });
      setSearchedOutput(results);
    }
    
    
    useEffect(() =>{
      getAllGuests()
    },[])
    
    const goToHome = () =>{
      navigate("/")
    }
    const openAddGuestModal = () => {
      setShowAddGuestModal(true);
    }
    const closeAddGuestModal = () => {
      setShowAddGuestModal(false);
    }
  return (
    <div>
      <div className="flex flex-col justify-start items-start m-7 gap-y-6">
        <div className='flex justify-center items-center gap-x-2'>
            <div className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70" onClick={() => goToHome()}>
              <HomeIcon />
              <span>Home</span>
            </div>
            <div className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70" onClick={openAddGuestModal}>
              <AddIcon />
              <span>Add Guest</span>
            </div>
        </div>
        {showAddGuestModal && <AddGuestModal refreshData={getAllGuests} closeModal={closeAddGuestModal} />}
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
          placeholder="Enter Guest Name or Table Number"
          minLength = {4}
          required
          autoFocus
          type="text"
          onChange = {(e) => findGuest(e.target.value)}
        />
      </div>

      <div>
        Total Guest Count: {allGuestData.length}
      </div>
      
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-blue-500 font-bold text-white bg-blue-500 w-full">
        <span className="w-1/3">Full Name</span>
        <span className="w-1/6 text-center">Table</span>
        <span className="w-1/6 text-right">Edit / Delete</span>
      </div>
      <div>
      {
        viewAllGuests 
        //testData.map.....
          ? allGuestData.map((guest, index) => (
              <div key={index}>
                <GuestCard 
                  // guestId={index} 
                  // guestFullName={guest.fullName} 
                  // guestTableNumber={guest.tableNumber}
                  guestId={guest.guest_id} 
                  guestFullName={guest.guest_name} 
                  guestTableNumber={guest.table_number}
                  refreshData={getAllGuests}
                />
              </div>
            ))
          : searchedOutput.map((guest, index) => (
              <div key={index}>
                <GuestCard 
                  // guestId={index} 
                  // guestFullName={guest.fullName} 
                  // guestTableNumber={guest.tableNumber}
                  guestId={guest.guest_id} 
                  guestFullName={guest.guest_name} 
                  guestTableNumber={guest.table_number}
                  refreshData={getAllGuests}
                />
              </div>
            ))
            
        }

        {searchedOutput.length == 0 && searchedItem.length > 0 && <div className='text-md font-normal'>No guests found</div>}
        {allGuestData.length == 0 && <div className='text-md font-normal'>No guests in database</div>}
      </div>
    </div>
  )
}
export default AdminPage