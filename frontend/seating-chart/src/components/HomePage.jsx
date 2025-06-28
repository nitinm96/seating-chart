import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PasswordModal from "./PasswordModal";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";
import { UserContext } from "../context/UserContext";

function HomePage() {
  const navigate = useNavigate();
  const [allGuestData, setAllGuestData] = useState([]);
  const [searchedGuest, setSearchedGuest] = useState("");
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);
  const { user } = useContext(UserContext);
  // Fetch all guest data on component mount
  useEffect(() => {
    getAllSeating();
  }, []);

  // API call to fetch all guest records
  const getAllSeating = async () => {
    try {
      // Reset state
      dispatch({ type: ACTION_TYPES.RESET });

      const API_URL =
        import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
      const response = await axios.get(`${API_URL}`);
      const data = response.data;

      // Handle empty response
      if (data.guestCount == 0) {
        dispatch({
          type: ACTION_TYPES.GET_ERROR,
          payload: { error: data?.error || "No guests found in database" },
        });
        return;
      }

      // Sort guest list alphabetically
      const sortedData = [...data.allGuests].sort((a, b) =>
        a.guest_name.localeCompare(b.guest_name)
      );
      setAllGuestData(sortedData);
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        "Something went wrong, Please try again later.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };

  // Filter and display matching guests based on input
  function findGuest(e) {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.RESET_ERROR });

    const search = searchedGuest.toLowerCase().trim();
    const results = allGuestData.filter((guest) =>
      guest.guest_name.toLowerCase().includes(search)
    );

    if (results.length == 0) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: {
          error: (
            <div>
              No guests found with search result "<b>{searchedGuest}</b>"
              <br></br>
              <div className="mt-3">
                Please check the spelling, or contact a host.
              </div>
            </div>
          ),
        },
      });
    }
    setSearchedOutput(results);
  }

  // Clears input field and any visible errors
  const handleResetSearch = () => {
    setSearchedGuest("");
    if (state.error) dispatch({ type: ACTION_TYPES.RESET_ERROR });
  };

  // Toggles password modal visibility
  const openPasswordModal = () => {
    if (user) {
      goToAdmin();
      return;
    }
    setShowPasswordModal(!showPasswordModal);
  };
  const closePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  // Redirects to /admin route
  const goToAdmin = () => {
    navigate("/admin");
  };

  // Fun easter egg (not currently hooked into UI)
  const funAnimation = (guest) => {
    switch (guest) {
      case "Nitin Minhas":
        alert("YOU'RE THE GROOM");
      case "Lavanya Verma":
        alert("YOU'RE THE BRIDE");
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[url(/assets/backgroundImg.jpg)] bg-cover bg-center">
      {/* Dark overlay over background image */}
      <div className="flex flex-col justify-start items-center w-full bg-black/35 min-h-screen">
        {/* Admin button and modal */}
        <div className="flex justify-end w-full">
          {showPasswordModal && (
            <PasswordModal
              goToAdmin={goToAdmin}
              closeModal={closePasswordModal}
            />
          )}
          <div
            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 m-2 rounded hover:opacity-80 active:opacity-60 active:ring-1 cursor-pointer"
            onClick={openPasswordModal}
          >
            <BuildCircleIcon />
            <span>Admin</span>
          </div>
        </div>

        {/* Search input form */}
        <div className="flex flex-col justify-center items-center p-8 rounded-2xl">
          <div className="text-xl text-center text-white">
            Please enter full name or surname to find your table number below:
          </div>

          <form
            method="post"
            onSubmit={findGuest}
            className="flex flex-col sm:flex-row justify-center items-end mt-5 w-full gap-x-3"
          >
            {/* Input field with search and clear icons */}
            <div className="flex w-full sm:w-3/4 items-center pl-2 pr-2 py-2 border-1 shadow-lg bg-white border-gray-300 rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <SearchIcon htmlColor="#9d9d9e" />
              <input
                className="w-full outline-none text-sm"
                type="text"
                name="fullName"
                value={searchedGuest}
                required
                minLength={3}
                placeholder="Ex: Nitin Minhas or Minhas"
                onChange={(e) => setSearchedGuest(e.target.value)}
                onFocus={() => {
                  state.error && dispatch({ type: ACTION_TYPES.RESET_ERROR });
                }}
              />
              {searchedGuest.length > 0 && (
                <CloseIcon
                  className="cursor-pointer"
                  onClick={handleResetSearch}
                  fontSize="small"
                  htmlColor="#9d9d9e"
                />
              )}
            </div>

            <button
              className="cursor-pointer py-2 px-7 mt-6 hover:opacity-90 active:opacity-60 active:ring-1 bg-blue-500 rounded text-white"
              type="submit"
            >
              Find Table
            </button>
          </form>
        </div>

        {/* Search results */}
        {searchedOutput.length !== 0 && (
          <div className=" bg-white/85 rounded-lg shadow-sm px-8 py-4 mt-4 mb-16">
            <div className="flex items-center justify-between mb-4 font-bold gap-x-14 text-lg whitespace-nowrap">
              <div>Guest Name</div>
              <div>Table Number</div>
            </div>
            <ul className="text-sm">
              {searchedOutput.map((guest) => (
                <li key={guest.guest_id} className="my-4 py-2 border-b-1">
                  <div className="flex items-center justify-between">
                    <div className="text-md text-gray-900 whitespace-nowrap">
                      {guest.guest_name}
                    </div>
                    <div className="w-20 text-center text-md text-gray-900 font-semibold">
                      {guest.table_number}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display error message */}
        {state.error && (
          <div className="flex justify-center p-4 rounded-xl bg-white/80 mt-12">
            <div className="text-gray-500 text-center text-xs underline">
              {state.errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
