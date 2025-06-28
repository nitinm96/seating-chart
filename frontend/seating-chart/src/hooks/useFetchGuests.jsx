import axios from "axios";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  guestReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/guestReducer";

function useFetchGuests(apiUrl) {
  const [guestData, setGuestData] = useState([]);
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  const fetchGuests = async (url) => {
    dispatch({ type: ACTION_TYPES.RESET });
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

      setGuestData(sortedData);
    } catch (error) {
      console.error(error.response);
      const errMsg =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };

  useEffect(() => {
    fetchGuests(apiUrl);
  }, []);

  return { guestData, state, dispatch, fetchGuests };
}

export default useFetchGuests;
