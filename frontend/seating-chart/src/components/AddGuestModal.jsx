import React, { useState, useReducer } from "react";
import axios from "axios";
import { guestReducer, INITIAL_STATE } from "../reducers/guestReducer";

function AddGuestModal({ refreshData, closeModal }) {
  const [guestName, setGuestName] = useState("");
  const [tableNumber, setTableNumber] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [guestAdded, setGuestAdded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [currentState] = useReducer(guestReducer, INITIAL_STATE);

  const addGuest = async () => {
    //reset variables
    setError(false);
    setErrorMessage("");
    setGuestAdded(false);
    setSuccessMessage("");

    //validate input fields
    if (guestName == "" || !tableNumber) {
      setError(true);
      setErrorMessage("Input all fields");
      return;
    }
    const cleanName = SanitizeName(guestName);

    console.log(cleanName, tableNumber);
    //add guest post request
    try {
      const response = await axios.post(`http://localhost:5001/api/guests/`, {
        fullName: cleanName,
        tableNumber: tableNumber,
      });
      console.log(response.data);
      //refresh data, close modal
      setGuestAdded(true);
      setSuccessMessage(`Guest ${cleanName} added successfully!`);
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
      setError(true);
      setErrorMessage(errMsg);
    }
  };

  function SanitizeName(name) {
    let split = name.split(" ");
    for (let i = 0; i < split.length; i++) {
      split[i] = split[i][0].toUpperCase() + split[i].slice(1);
    }
    const sanitizedName = split.join(" ");
    return sanitizedName;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
        <div className="grid gap-6">
          {currentState.changeMade ? (
            <div className="text-md font-normal">
              {currentState.successMessage}
            </div>
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
                  id="guest_name"
                  placeholder="Enter guest first and last name"
                  onChange={(e) => setGuestName(e.target.value)}
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
                  id="table_number"
                  placeholder="Enter table number"
                  required
                  onChange={(e) => setTableNumber(parseInt(e.target.value))}
                />
              </div>
              {currentState.error && (
                <p className="text-red-500">{currentState.errorMessage}</p>
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
