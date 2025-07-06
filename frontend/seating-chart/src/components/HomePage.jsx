import React, { useContext, useEffect, useState } from "react";
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
import useFetchGuests from "../hooks/useFetchGuests";
import { GuestDataContext } from "../context/GuestDataContext";
import GiftModal from "./GiftModal";

const bridalPartyMap = {
  "Prem Khullar": "https://media.tenor.com/X15e67QrANUAAAAM/the-office.gif",
  "Varun Gupta":
    "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/18/1493803594-source.gif",
  "Aseem Bhuri": "https://i.makeagif.com/media/4-24-2023/j2yxiN.gif",
  "Moksh Bhuri":
    "https://i.pinimg.com/originals/86/f2/3f/86f23fcc40ffd501b2064ecc0eb7e99c.gif",
  "Yatin Dhawan":
    "https://media.tenor.com/I44ftd7STHcAAAAM/stenchpreet-jus-reign.gif",
  "Sameer Krishan":
    "https://images.steamusercontent.com/ugc/266105270676560197/23EBF78D4D3F1C99E4175D56B633A8D0D9743F32/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
  "Gurpreet Chatha":
    "https://blog.opiumworks.com/hs-fs/hubfs/Opium%20Works%20Calendar%202023/June%202023/barbie2.gif",
  // add more as needed
};
function HomePage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // State
  const [searchedGuest, setSearchedGuest] = useState("");
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const [gifGuest, setGifGuest] = useState("");

  // Data & state from custom fetch hook
  const API_URL =
    import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
  const { state, dispatch } = useFetchGuests(API_URL);
  const { guests } = useContext(GuestDataContext);

  // Search handler
  const findGuest = (e) => {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.RESET_ERROR });

    const query = searchedGuest.toLowerCase().trim();
    const results = guests.filter((guest) =>
      guest.guest_name.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: {
          error: (
            <div>
              No guests found with search result "<b>{searchedGuest}</b>"
              <br />
              <div className="mt-3">
                Please check the spelling, or contact a host.
              </div>
            </div>
          ),
        },
      });
    }

    setSearchedOutput(results);
  };

  // Reset search input and error state
  const handleResetSearch = () => {
    setSearchedGuest("");
    setSearchedOutput([]);
    if (state.error) {
      dispatch({ type: ACTION_TYPES.RESET_ERROR });
    }
  };

  // Admin access logic
  const openPasswordModal = () => {
    const authed = localStorage.getItem("user");
    if (authed) {
      setUser(true);
      goToAdmin();
    }
    if (user) return goToAdmin();
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => setShowPasswordModal(false);

  const openGifModal = () => setShowGifModal(true);
  const closeGifModal = () => setShowGifModal(false);

  const goToAdmin = () => navigate("/admin");

  useEffect(() => {
    const found = searchedOutput.find((guest) =>
      Object.keys(bridalPartyMap).includes(guest.guest_name)
    );
    if (found) {
      setGifGuest(bridalPartyMap[found.guest_name]);
      openGifModal();
    }
  }, [searchedOutput]);

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
        {showGifModal && gifGuest && (
          <GiftModal gifLink={gifGuest} closeModal={closeGifModal} />
        )}
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
