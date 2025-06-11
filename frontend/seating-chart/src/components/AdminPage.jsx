import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GuestCard from "./GuestCard";
import testData from "../testData/guestData.json";
import AddGuestModal from "./AddGuestModal";

function AdminPage() {
  const navigate = useNavigate();
  const [allGuestData, setAllGuestData] = useState([]);
  const [searchedItem, setSearchedItem] = useState("");
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [viewAllGuests, setViewAllGuests] = useState(true);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getAllGuests = async () => {
    try {
      setError(false);
      setErrorMessage("");
      const response = await axios.get("http://localhost:5001/api/guests");
      console.log(response);
      const data = response.data;
      if (data.guestCount == 0) {
        setError(true);
        setErrorMessage(data.error);
        return;
      }
      setAllGuestData(data.allGuests);
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(err);
    }
  };

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
      const tableMatch = guest.table_number.toString() === search;
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

  useEffect(() => {
    getAllGuests();
  }, []);

  const goToHome = () => {
    navigate("/");
  };
  const openAddGuestModal = () => {
    setShowAddGuestModal(true);
  };
  const closeAddGuestModal = () => {
    setShowAddGuestModal(false);
  };
  return (
    <div>
      <div className="flex flex-col justify-start items-start m-7 gap-y-6">
        <div className="flex justify-center items-center gap-x-2">
          <div
            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70"
            onClick={() => goToHome()}
          >
            <HomeIcon />
            <span>Home</span>
          </div>
          <div
            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70"
            onClick={openAddGuestModal}
          >
            <AddIcon />
            <span>Add Guest</span>
          </div>
        </div>
        {showAddGuestModal && (
          <AddGuestModal
            refreshData={getAllGuests}
            closeModal={closeAddGuestModal}
          />
        )}

        <div className="flex w-full sm:w-1/3 pl-2 pr-2 py-2 border border-gray-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <SearchIcon className="" htmlColor="#d1d5dc" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Enter Guest Name or Table Number"
            minLength={4}
            required
            autoFocus
            type="text"
            onChange={(e) => findGuest(e.target.value)}
          />
        </div>
      </div>

      <div>Total Guest Count: {error ? 0 : allGuestData.length}</div>

      <div className="flex justify-between items-center p-4 font-medium bg-gray-300 mt-4 w-full">
        <span className="w-1/3">Full Name</span>
        <span className="w-1/6 text-center">Table</span>
        <span className="w-1/6 text-right">Action</span>
      </div>
      <div>
        {error ? (
          <div className="text-md font-normal">{errorMessage}</div>
        ) : viewAllGuests ? (
          //testData.map.....
          allGuestData.map((guest, index) => (
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
        ) : (
          searchedOutput.map((guest, index) => (
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
        )}

        {searchedOutput.length == 0 && searchedItem.length > 0 && (
          <div className="text-md font-normal">No guests found</div>
        )}
      </div>
    </div>
  );
}
export default AdminPage;
