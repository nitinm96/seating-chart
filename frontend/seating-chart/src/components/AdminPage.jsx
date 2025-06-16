import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GuestCard from "./GuestCard";
import AddGuestModal from "./AddGuestModal";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";

function AdminPage() {
  const navigate = useNavigate();
  const [allGuestData, setAllGuestData] = useState([]);
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [viewAllGuests, setViewAllGuests] = useState(true);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  useEffect(() => {
    getAllGuests();
  }, []);

  const getAllGuests = async () => {
    try {
      dispatch({ type: ACTION_TYPES.RESET });
      const response = await axios.get("http://localhost:5001/api/guests");
      console.log(response);
      const data = response.data;

      if (data.guestCount == 0) {
        dispatch({
          type: ACTION_TYPES.GET_ERROR,
          payload: { error: data?.error || "No guests found in database" },
        });
        return;
      }
      const sortedData = [...data.allGuests].sort((a, b) =>
        a.guest_name.localeCompare(b.guest_name)
      );
      setAllGuestData(sortedData);
    } catch (error) {
      console.error(error.response);
      const errMsg =
        error.response?.data?.error ||
        "Something went wrong. Please try again later.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };

  const findGuest = (e) => {
    dispatch({ type: ACTION_TYPES.RESET_ERROR });
    const search = e.target.value.trim().toLowerCase();

    // Show all guests if search is too short
    if (search.length < 1) {
      setViewAllGuests(true);
      setSearchedOutput([]);
      return;
    }
    const results = allGuestData.filter((guest) => {
      const nameMatch = guest.guest_name.toLowerCase().includes(search);
      const tableMatch = guest.table_number.toString() === search;
      return nameMatch || tableMatch;
    });
    if (results.length == 0 && search.length > 0) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: { error: "No guests found" },
      });
    }
    setSearchedOutput(results);
    setViewAllGuests(false);
  };

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
            onChange={findGuest}
          />
        </div>
      </div>

      <div>
        {state.error
          ? "Total Guest Count: 0"
          : searchedOutput.length > 0
          ? `Searched Guest Count: ${searchedOutput.length}`
          : `Total Guest Count: ${allGuestData.length}`}
      </div>

      <div className="flex justify-between items-center p-4 font-medium bg-gray-300 mt-4 w-full">
        <span className="w-1/3">Full Name</span>
        <span className="w-1/6 text-center">Table</span>
        <span className="w-1/6 text-right">Action</span>
      </div>
      <div>
        {state.error ? (
          <div className="text-md font-normal">{state.errorMessage}</div>
        ) : viewAllGuests ? (
          allGuestData.map((guest, index) => (
            <div key={index}>
              <GuestCard
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
                guestId={guest.guest_id}
                guestFullName={guest.guest_name}
                guestTableNumber={guest.table_number}
                refreshData={getAllGuests}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default AdminPage;
