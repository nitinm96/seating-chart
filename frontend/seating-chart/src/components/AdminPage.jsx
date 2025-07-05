import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash.debounce";
import GuestCard from "./GuestCard";
import AddGuestModal from "./AddGuestModal";
import { ACTION_TYPES } from "../reducers/guestReducer";
import useFetchGuests from "../hooks/useFetchGuests";
import { GuestDataContext } from "../context/GuestDataContext";

function AdminPage() {
  const navigate = useNavigate();

  // UI State
  const [search, setSearch] = useState("");
  const [searchedOutput, setSearchedOutput] = useState([]);
  const [viewAllGuests, setViewAllGuests] = useState(true);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  // API & Guest Data
  const API_URL =
    import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
  const { state, dispatch, fetchGuests } = useFetchGuests(API_URL, false);
  const { guests } = useContext(GuestDataContext);

  // Keep latest error state in ref to prevent stale closure issues in debounce
  const errorRef = useRef(state.error);
  useEffect(() => {
    errorRef.current = state.error;
  }, [state.error]);

  // Utility: Reset UI state
  const handleResetSearch = () => {
    setSearch("");
    setSearchedOutput([]);
    setViewAllGuests(true);
    if (errorRef.current) dispatch({ type: ACTION_TYPES.RESET_ERROR });
  };

  // Search Logic (Debounced)
  const findGuest = useCallback(
    (searchInput) => {
      const query = searchInput.toLowerCase().trim();
      if (query === "") {
        debouncedSearch.cancel();
        handleResetSearch();
        return;
      }

      const results = guests.filter((guest) => {
        const name = guest.guest_name?.toLowerCase().includes(query);
        const table = guest.table_number?.toString() === query;
        return name || table;
      });

      if (results.length === 0) {
        dispatch({
          type: ACTION_TYPES.GET_ERROR,
          payload: { error: "No guests found..." },
        });
      } else if (errorRef.current) {
        dispatch({ type: ACTION_TYPES.RESET_ERROR });
      }

      setSearchedOutput(results);
      setViewAllGuests(false);
    },
    [guests, dispatch]
  );

  // Debounce the search
  const debouncedSearch = useMemo(() => debounce(findGuest, 300), [findGuest]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Input handler
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearch(input);
    debouncedSearch(input);
  };

  // Re-run search if guest data is refreshed externally (e.g. after add/update/delete)
  useEffect(() => {
    if (search.trim()) {
      findGuest(search);
    }
  }, [guests]); // safe because findGuest is stable via useCallback

  // toggle add guest model
  const openAddGuestModal = () => setShowAddGuestModal(true);
  const closeAddGuestModal = () => setShowAddGuestModal(false);

  // Navigation
  const goToHome = () => navigate("/");

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
            onChange={(e) => handleInputChange(e)}
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
            ? `Total Guest Count: ${guests.length}`
            : `${searchedOutput.length} guests found`}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 font-bold w-full shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white mb-2">
        <span className="w-1/3">Full Name</span>
        <span className="w-1/6 text-center">Table</span>
        <span className="w-1/6 text-right">Action</span>
      </div>
      {state.loading && <div className="tex-center">loading...</div>}
      <div className="mb-10">
        {state.error ? (
          <div className="flex justify-center items-center p-4">
            <div className="text-gray-500 text-sm border-b-1 border-gray-500">
              {state.errorMessage}
            </div>
          </div>
        ) : viewAllGuests ? (
          guests.map((guest, index) => (
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
