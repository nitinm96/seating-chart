import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { CaptializeFullName } from "../util/stringUtils.js";
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

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_GUEST_DATA,
      payload: {
        guestName: guestFullname,
        tableNumber: guestTableNumber,
      },
    });
  }, []);

  const editGuest = async (id) => {
    //reset state
    dispatch({ type: ACTION_TYPES.RESET });

    //validate user inputs
    const guest_name = state.guestName;
    const clean_table_number = parseInt(state.tableNumber);

    if (guest_name == "" || !clean_table_number) {
      dispatch({
        type: ACTION_TYPES.GET_ERROR,
        payload: { error: "Input all fields correctly" },
      });
      return;
    }
    //sanitize names so first letters of firstname and lastname are capitalized
    const cleanName = CaptializeFullName(guest_name);
    console.log(id, cleanName, clean_table_number);

    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_API || "http://localhost:5001/api/guests";
      const response = await axios.put(`${API_URL}/${id}`, {
        fullName: cleanName,
        tableNumber: clean_table_number,
      });
      console.log(response);
      dispatch({ type: ACTION_TYPES.GET_GUEST_UPDATED });
      refreshData();
      setTimeout(() => {
        closeModal();
      }, 1500);
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
        <div className="grid gap-6">
          {state.guestUpdated ? (
            <div className="text-md font-normal">{state.successMessage}</div>
          ) : (
            <>
              <div className="font-bold text-xl">Update Guest</div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Guest Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  type="text"
                  name="guestName"
                  defaultValue={state.guestName}
                  placeholder="Enter Guest Name"
                  minLength={4}
                  required
                  onChange={handleInput}
                  onFocus={() => dispatch({ type: ACTION_TYPES.RESET_ERROR })}
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
                  defaultValue={state.tableNumber}
                  minLength={1}
                  maxLength={2}
                  required
                  onChange={handleInput}
                  onFocus={() => dispatch({ type: ACTION_TYPES.RESET_ERROR })}
                />
              </div>
              {state.error && (
                <p className="text-red-500">{state.errorMessage}</p>
              )}
              <div className="flex justify-center items-center gap-x-6">
                <button
                  type="button"
                  onClick={() => editGuest(guestId)}
                  className=" text-white bg-blue-500 border-blue-500 border-2 rounded-lg px-8 py-2 cursor-pointer hover:opacity-85 active:opacity-85 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="border-blue-500 border-2 rounded-lg px-8 py-2 cursor-pointer hover:opacity-85 hover:bg-blue-500 hover:text-white active:bg-gray-100"
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

export default UpdateModal;
