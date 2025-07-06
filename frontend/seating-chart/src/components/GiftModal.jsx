import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function GiftModal({ gifGuest, closeModal }) {
  const { name, side, gifLink } = gifGuest;
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full p-5">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 cursor-pointer"
        >
          <CloseIcon fontSize="medium" />
        </button>

        {/* Title */}
        <div className="text-center mb-4">
          <h2
            className={
              side === "groomsmen"
                ? "text-xl font-bold text-blue-500"
                : "text-xl font-bold text-pink-500"
            }
          >
            🎉 Welcome {name} 🎉
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for being my {side}! Find your table and we'll see you
            shortly 😀
          </p>
        </div>

        {/* GIF */}
        <div className="flex justify-center items-center rounded-lg overflow-hidden">
          <img
            src={gifLink}
            alt="Celebration Gif"
            className="max-h-64 w-auto object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default GiftModal;
