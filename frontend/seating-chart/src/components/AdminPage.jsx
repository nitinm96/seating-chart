import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import GuestCard from "./GuestCard";
import AddGuestModal from "./AddGuestModal";
import { ACTION_TYPES } from "../reducers/guestReducer";
import useFetchGuests from "../hooks/useFetchGuests";

function AdminPage() {
  const navigate = useNavigate();
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [search, setSearch] = useState("");
  const [viewAllGuests, setViewAllGuests] = useState(true);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  const API_URL =
    import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
  const { guestData, state, dispatch, fetchGuests } = useFetchGuests(API_URL);

  const findGuest = (e) => {
    const input = e.target.value;
    const search = input.toLowerCase();

    // Avoid unnecessary dispatch or state updates
    if (state.error && search.length > 0) {
      dispatch({ type: ACTION_TYPES.RESET_ERROR });
    }

    setSearch(search);

    if (search === "") {
      setViewAllGuests(true);
      setSearchedOutput([]);
      return;
    }

    const results = guestData.filter((guest) => {
      const name = guest.guest_name?.toLowerCase() || "";
      const table = guest.table_number?.toString() || "";
      return name.includes(search) || table === search;
    });

    if (results.length === 0) {
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
    if (state.error) dispatch({ type: ACTION_TYPES.RESET_ERROR });
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
            closeModal={closeAddGuestModal}
            refreshData={fetchGuests}
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
            ? `Total Guest Count: ${guestData.length}`
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
          guestData.map((guest, index) => (
            <div key={index}>
              <GuestCard
                guestId={guest.guest_id}
                guestFullName={guest.guest_name}
                guestTableNumber={guest.table_number}
                refreshData={fetchGuests}
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
                refreshData={fetchGuests}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default AdminPage;
