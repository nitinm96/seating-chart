import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function PasswordModal({ goToAdmin, closeModal }) {
  const { user, setUser, authUser } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const validateAdmin = () => {
    const result = authUser(password);
    if (result) {
      setUser(result);
      goToAdmin();
    } else {
      setUser(result);
      setError(true);
      return;
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white rounded-2xl p-6 gap-y-2 mx-5">
        <div className="">
          <div className="mb-3">
            <label className="block mb-2 font-bold">Password</label>
            <input
              className={
                error
                  ? "bg-gray-50 border-2 border-red-500 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              }
              type="password"
              placeholder="Enter password"
              required
              autoFocus
              minLength={4}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setError(false)}
            />
          </div>
        </div>
        {error && (
          <span className="text-sm text-red-400">Incorrect password</span>
        )}
        <div className="flex justify-center items-center gap-x-6">
          <button
            type="button"
            onClick={validateAdmin}
            className=" text-white bg-blue-500 ring-2 ring-blue-500 rounded-lg px-8 py-2 active:bg-blue-400"
          >
            Enter
          </button>
          <button
            type="button"
            className="ring-2 ring-blue-500 rounded-lg px-8 py-2 text-blue-500 active:bg-gray-100"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
