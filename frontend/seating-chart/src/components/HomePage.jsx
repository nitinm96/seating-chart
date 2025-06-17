import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import SearchIcon from "@mui/icons-material/Search";
import PasswordModal from "./PasswordModal";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";
import guestData from "../testData/guestData.json";

function HomePage() {
  const navigate = useNavigate();
  const [allGuestData, setAllGuestData] = useState([]);
  const [searchedGuest, setSearchedGuest] = useState("");
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  useEffect(() => {
    getAllSeating();
  }, []);

  const getAllSeating = async () => {
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
        "Something went wrong, Please try again later.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };

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
        payload: { error: "No guests found, please see hosts" },
      });
    }
    setSearchedOutput(results);
  }

  const openPasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };
  const closePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };
  const goToAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="h-screen bg-[url(../../assets/backgroundImg.jpg)] bg-cover bg-center">
      {/* Background Image Layer */}

      {/* Content Layer */}
      <div className="flex flex-col justify-start items-center w-full bg-black/35 h-screen">
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
        <div className="flex flex-col justify-center items-center p-8 rounded-2xl">
          <div className="text-xl text-center text-white">
            Please enter your full name or surname to find table number below:
          </div>
          <form
            method="post"
            onSubmit={findGuest}
            className="flex flex-col justify-center items-end mt-5 w-full"
          >
            <div className="flex w-full sm:w-3/4 pl-2 pr-2 py-2 border-1 shadow-lg bg-white border-gray-300 rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <SearchIcon htmlColor="#d1d5dc" />
              <input
                className="w-full outline-none text-sm"
                type="text"
                name="fullName"
                required
                minLength={3}
                placeholder="Ex: Nitin Minhas or Minhas"
                onChange={(e) => setSearchedGuest(e.target.value)}
                onFocus={() => dispatch({ type: ACTION_TYPES.RESET_ERROR })}
              />
            </div>
            <button
              className="cursor-pointer py-2 px-8 mt-6 hover:opacity-90 active:opacity-60 active:ring-1 bg-blue-500 rounded text-white"
              type="submit"
            >
              Find Table
            </button>
          </form>
        </div>

        {/* Display searched items */}
        {searchedOutput.length !== 0 && (
          <div className=" bg-white/70 rounded-lg shadow-sm px-8 py-4 mt-4 mb-16">
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

        {/* Error Message */}
        {state.error && (
          <div className="flex justify-center p-5 rounded-xl bg-white/80 mt-12">
            <div className="text-gray-500 text-xs border-b border-gray-500">
              {state.errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
