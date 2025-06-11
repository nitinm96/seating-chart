import React from "react";
import axios from "axios";
import { useState } from "react";

function UpdateModal({
  guestId,
  guestFullname,
  guestTableNumber,
  closeModal,
  refreshData,
}) {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedTable, setUpdatedTable] = useState();
  const [guestUpdated, setGuestUpdated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const editGuest = async (id) => {
    //reset state
    setGuestUpdated(false);
    setSuccessMessage("");
    setError(false);
    setErrorMessage("");

    if (updatedName.length <= 3 || !updatedTable) {
      console.log("error with user input");
      setError(true);
      setErrorMessage("input all fields");
      return;
    }
    console.log(id, updatedName, updatedTable, typeof updatedTable);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/guests/${id}`,
        {
          fullName: updatedName,
          tableNumber: updatedTable,
        }
      );
      console.log(response.data);
      setGuestUpdated(true);
      setSuccessMessage("Guest updated successfully");

      refreshData();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
        {guestUpdated ? (
          <div className="text-md font-normal">{successMessage}</div>
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
                  id="guest_name"
                  placeholder={guestFullname}
                  onChange={(e) => setUpdatedName(e.target.value)}
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
                  placeholder={guestTableNumber}
                  required
                  onChange={(e) => setUpdatedTable(parseInt(e.target.value))}
                />
              </div>
            </div>
            {error && <p className="text-red-500">{errorMessage}</p>}
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
