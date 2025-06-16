import React, { useReducer, useState } from "react";
import axios from "axios";
import {
  guestReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/guestReducer";

function DeleteModal({ guestId, guestName, closeModal, refreshData }) {
  const [state, dispatch] = useReducer(guestReducer, INITIAL_STATE);

  const deleteGuest = async (id) => {
    //reset state
    dispatch({ type: ACTION_TYPES.RESET });

    try {
      const response = await axios.delete(
        `http://localhost:5001/api/guests/${id}`
      );
      console.log(response.data);

      dispatch({ type: ACTION_TYPES.GET_GUEST_DELETED, payload: guestName });

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
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
        {state.guestDeleted ? (
          <div className="text-md font-normal">{state.successMessage}</div>
        ) : (
          <>
            <div className="font-bold text-xl">Confirm Delete</div>
            <div>Are you sure you want to delete {guestName}?</div>
            <div className="flex justify-center items-center gap-x-6">
              <button
                type="button"
                className=" text-white bg-red-700 border-red-700 border-2 rounded-lg px-8 py-2"
                onClick={() => deleteGuest(guestId)}
              >
                Yes
              </button>
              <button
                type="button"
                className="border-blue-700 border-2 rounded-lg px-8 py-2"
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteModal;
