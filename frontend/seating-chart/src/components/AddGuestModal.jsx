import React, { useState, useReducer } from "react";
import axios from "axios";
import { CaptializeFullName } from "../util/stringUtils.js";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";

function AddGuestModal({ closeModal, refreshData }) {
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  //validate user entered data
  function validateGuestInfo() {
    //validate user inputs
    let cleanName = state.guestName;
    const clean_table_number = parseInt(state.tableNumber);

    if (cleanName == "" || !clean_table_number) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: { error: "Input all fields correctly" },
      });
      return { cleanName, clean_table_number };
    }
    //sanitize names so first letters of firstname and lastname are capitalized
    cleanName = CaptializeFullName(cleanName);
    return { cleanName, clean_table_number };
  }

  const addGuest = async () => {
    //reset state
    dispatch({ type: ACTION_TYPES.RESET });

    const { cleanName, clean_table_number } = validateGuestInfo();
    if (!cleanName || !clean_table_number) return;
    console.log(`adding guest: ${cleanName} at table ${clean_table_number}`);

    //add guest post request
    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
      const response = await axios.post(`${API_URL}`, {
        fullName: cleanName,
        tableNumber: clean_table_number,
      });
      console.log(response.data);
      //refresh data, close modal
      dispatch({ type: ACTION_TYPES.GET_GUEST_ADDED });
      await refreshData(API_URL);

      //set delay to show success message
      setTimeout(() => {
        closeModal();
      }, 2500);
    } catch (error) {
      console.error(error.response);
      const errMsg =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      dispatch({ type: ACTION_TYPES.GET_ERROR, payload: { error: errMsg } });
    }
  };
  //handle input on change with reducer
  const handleInput = (e) => {
    dispatch({
      type: ACTION_TYPES.CHANGE_INPUT,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2">
        <div className="grid gap-6">
          {state.guestAdded ? (
            <div className="text-md font-normal">{state.successMessage}</div>
          ) : (
            <>
              <div className="font-bold text-xl">Add Guest</div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Guest Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  type="text"
                  name="guestName"
                  placeholder="Enter guest first and last name"
                  onChange={handleInput}
                  onFocus={() => dispatch({ type: ACTION_TYPES.RESET_ERROR })}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Table Number
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  name="tableNumber"
                  placeholder="Enter table number"
                  onChange={handleInput}
                  onFocus={() => dispatch({ type: ACTION_TYPES.RESET_ERROR })}
                  required
                />
              </div>
              {state.error && (
                <p className="text-red-500 text-sm">{state.errorMessage}</p>
              )}
              <div className="flex justify-between items-center gap-x-6">
                <button
                  type="button"
                  onClick={addGuest}
                  className=" text-white w-full text-sm bg-blue-500 border-blue-500 border-2 rounded-lg px-6 py-2 cursor-pointer hover:opacity-85 active:opacity-85 whitespace-nowrap"
                >
                  Add Guest
                </button>
                <button
                  type="button"
                  className="border-blue-500 w-full text-sm border-2 rounded-lg px-6 py-2 cursor-pointer hover:opacity-85 hover:bg-blue-500 active:bg-gray-100"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddGuestModal;
