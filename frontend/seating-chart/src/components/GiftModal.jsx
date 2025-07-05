import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function GiftModal({ gifLink, closeModal, guestName }) {
  return (
    <div
      className="fixed inset-0 flex justify-center items-start z-50 mt-20 mx-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white p-5 rounded-xl">
        <div className="cursor-pointer" onClick={closeModal}>
          <CloseIcon fontSize="sm" />
        </div>
        <p>BRIDAL PARTY IS HERE</p>
        <img src={gifLink} />
      </div>
    </div>
  );
}

export default GiftModal;
