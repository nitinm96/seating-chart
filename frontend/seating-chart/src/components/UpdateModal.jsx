import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { useState } from "react";
import {
  ACTION_TYPES,
  guestReducer,
  INITIAL_STATE,
} from "../reducers/guestReducer";

function UpdateModal({
  guestId,
  guestFullname,
  guestTableNumber,
  closeModal,
  refreshData,
}) {
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  const editGuest = async (id) => {
    //reset state
    dispatch({ type: ACTION_TYPES.RESET });

    //check if name and table number are not empty
    const fullName = state.guestName;
    const cleanTableNumber = parseInt(state.tableNumber);

    if (fullName == "" || !cleanTableNumber) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: { error: "Input all fields" },
      });
      return;
    }
    const cleanName = SanitizeName(fullName);
    console.log(id, cleanName, cleanTableNumber);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/guests/${id}`,
        {
          fullName: cleanName,
          tableNumber: cleanTableNumber,
        }
      );
      console.log(response);
      dispatch({
        type: ACTION_TYPES.GET_GUEST_UPDATED,
        payload: { guestName: cleanName },
      });
      refreshData();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  //function to santize names and have first letter uppercase for firstname and lastname
  function SanitizeName(name) {
    let split = name.split(" ");
    for (let i = 0; i < split.length; i++) {
      split[i] = split[i][0].toUpperCase() + split[i].slice(1);
    }
    const sanitizedName = split.join(" ");
    return sanitizedName;
  }

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_GUEST_DATA,
      payload: {
        guestName: guestFullname,
        tableNumber: parseInt(guestTableNumber),
      },
    });
  }, []);

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
        {state.guestUpdated ? (
          <div className="text-md font-normal">{state.successMessage}</div>
        ) : (
          <>
            <div className="grid gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Guest Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  type="text"
                  name="guestName"
                  defaultValue={guestFullname}
                  placeholder="Enter Guest Name"
                  minLength={3}
                  required
                  onChange={handleInput}
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
                  placeholder="Enter Table Number"
                  defaultValue={guestTableNumber}
                  required
                  onChange={handleInput}
                />
              </div>
            </div>
            {state.error && (
              <p className="text-red-500">{state.errorMessage}</p>
            )}
            <div className="flex justify-center items-center gap-x-6">
              <button
                type="button"
                onClick={() => editGuest(guestId)}
                className=" text-white bg-blue-500 border-blue-500 border-2 rounded-lg px-8 py-2 cursor-pointer hover:opacity-70"
              >
                Update
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
  );
}

export default UpdateModal;
