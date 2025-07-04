import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import {
  guestReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/guestReducer";
import { GuestDataContext } from "../context/GuestDataContext";

function useFetchGuests(apiUrl, autoFetch = true) {
  const [guestData, setGuestData] = useState([]);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);
  const { setGuests } = useContext(GuestDataContext);

  const fetchGuests = async (url) => {
    dispatch({ type: ACTION_TYPES.RESET });
    dispatch({ type: ACTION_TYPES.IS_LOADING, payload: true });

    try {
      const response = await axios.get(url);
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
      dispatch({ type: ACTION_TYPES.IS_LOADING, payload: false });
      setGuestData(sortedData);
      setGuests(sortedData);
    } catch (error) {
      console.error(error.response);
      const errMsg =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
      dispatch({ type: ACTION_TYPES.IS_LOADING, payload: false });
    }
  };

  useEffect(() => {
    if (autoFetch) {
      console.log("Fetching Guests....");
      fetchGuests(apiUrl);
    }
  }, []);

  return { guestData, state, dispatch, fetchGuests };
}

export default useFetchGuests;
