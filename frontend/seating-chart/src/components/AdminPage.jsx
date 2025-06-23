import React, { useEffect, useReducer, useState } from "react";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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
  const [search, setSearch] = useState("");
  const [viewAllGuests, setViewAllGuests] = useState(true);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  useEffect(() => {
    getAllGuests();
  }, []);

  const getAllGuests = async () => {
    try {
      dispatch({ type: ACTION_TYPES.RESET });
      const API_URL =
        import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
      const response = await axios.get(`${API_URL}`);
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
        "Something went wrong, Please try again later.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };

  const findGuest = (e) => {
    dispatch({ type: ACTION_TYPES.RESET_ERROR });
    const search = e.target.value.trim().toLowerCase();
    setSearch(search);
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
        payload: { error: "No guests found..." },
      });
    }
    setSearchedOutput(results);
    setViewAllGuests(false);
  };

  const handleResetSearch = () => {
    setSearch("");
    setViewAllGuests(true);
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
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70 active:bg-blue-400"
            onClick={() => goToHome()}
          >
            <HomeIcon />
            <span>Home</span>
          </div>
          <div
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-70 active:bg-blue-400"
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

        <div className="flex w-full justify-center items-center sm:w-1/3 pl-2 pr-2 py-2 border border-gray-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition shadow-lg">
          <SearchIcon className="" htmlColor="#9d9d9e" />
          <input
            className="w-full bg-transparent outline-none text-xs"
            placeholder="Enter Guest Name or Table Number"
            required
            value={search}
            autoFocus
            type="text"
            onChange={findGuest}
          />
          {search.length > 0 && (
            <CloseIcon
              className="cursor-pointer"
              onClick={handleResetSearch}
              fontSize="small"
              htmlColor="#9d9d9e"
            />
          )}
        </div>
        <div className="flex justify-start items-center px-2 text-sm">
          {state.error
            ? "Total Guest Count: 0"
            : viewAllGuests
            ? `Total Guest Count: ${allGuestData.length}`
            : `${searchedOutput.length} guests found`}
        </div>
      </div>

      <div className="flex justify-between items-center p-4 font-bold w-full shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white mb-2">
        <span className="w-1/3">Full Name</span>
        <span className="w-1/6 text-center">Table</span>
        <span className="w-1/6 text-right">Action</span>
      </div>
      <div className="mb-10">
        {state.error ? (
          <div className="flex justify-center items-center p-4">
            <div className="text-gray-500 text-sm border-b-1 border-gray-500">
              {state.errorMessage}
            </div>
          </div>
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
