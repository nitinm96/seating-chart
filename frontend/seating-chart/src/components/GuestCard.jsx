import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";

function GuestCard({ guestId, guestFullName, guestTableNumber, refreshData }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  //delete modal
  const openDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  //update modal
  const openUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };
  const closeUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  return (
    <div className="px-4 py-1 ">
      <div className="flex border-b-1 justify-between items-center w-full border-gray-200 text-sm">
        <span className="w-1/3 py-3 whitespace-nowrap">{guestFullName}</span>
        <span className="w-1/6 py-3 text-center">{guestTableNumber}</span>
        <div className="w-1/6 flex justify-end gap-x-3">
          <span
            className="cursor-pointer rounded-full ring-gray-100 hover:bg-gray-100 hover:ring-7 active:bg-gray-100 active:ring-7 transition"
            onClick={openUpdateModal}
          >
            <EditIcon htmlColor="#155dfc" />
            {showUpdateModal && (
              <UpdateModal
                guestId={guestId}
                guestFullname={guestFullName}
                guestTableNumber={guestTableNumber}
                closeModal={closeUpdateModal}
                refreshData={refreshData}
              />
            )}
          </span>
          <span
            className="cursor-pointer rounded-full ring-gray-100 hover:bg-gray-100 hover:ring-7 active:bg-gray-100 active:ring-7 transition"
            onClick={openDeleteModal}
          >
            <DeleteOutlineIcon htmlColor="#f51d28" />
            {showDeleteModal && (
              <DeleteModal
                guestId={guestId}
                guestName={guestFullName}
                guestTableNumber={guestTableNumber}
                closeModal={closeDeleteModal}
                refreshData={refreshData}
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
export default GuestCard;
