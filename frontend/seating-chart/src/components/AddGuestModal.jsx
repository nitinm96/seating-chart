import React, { useState, useReducer } from "react";
import axios from "axios";
import { CaptializeFullName } from "../util/stringUtils.js";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";

function AddGuestModal({ refreshData, closeModal }) {
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  const addGuest = async () => {
    //reset state
    dispatch({ type: ACTION_TYPES.RESET });

    const guest_name = state.guestName;
    const clean_table_number = parseInt(state.tableNumber);
    //validate input fields
    if (guest_name == "" || !clean_table_number) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: { error: "Input all fields correctly" },
      });
      return;
    }
    const cleanName = CaptializeFullName(guest_name);

    console.log(cleanName, clean_table_number);
    //add guest post request
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}`, {
        fullName: cleanName,
        tableNumber: clean_table_number,
      });
      console.log(response.data);
      //refresh data, close modal
      dispatch({ type: ACTION_TYPES.GET_GUEST_ADDED });
      refreshData();

      //set delay to show success message
      setTimeout(() => {
        closeModal();
      }, 2500);
    } catch (error) {
      console.error(error.response);
      const errMsg =
        error.response?.data?.error ||
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
  console.log(state);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
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
                <p className="text-red-500">{state.errorMessage}</p>
              )}
              <div className="flex justify-center items-center gap-x-6">
                <button
                  type="button"
                  onClick={addGuest}
                  className=" text-white bg-blue-500 border-blue-500 border-2 rounded-lg px-8 py-2 cursor-pointer hover:opacity-70"
                >
                  Add Guest
                </button>
                <button
                  type="button"
                  className="border-blue-500 border-2 rounded-lg px-8 py-2 cursor-pointer hover:opacity-85 hover:bg-blue-500 hover:text-white"
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
