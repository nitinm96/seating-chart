import React, { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

function GuestCard ({guestId, guestFullName, guestTableNumber, refreshData}){

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    //delete modal
    const openDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal)
    }
    const closeDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
      };
    
    //update modal
    const openUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal)
    }
    const closeUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal);
      };

    return (
        <div className="flex justify-between items-center px-4 py-2 border-b-2 border-blue-500 w-full">
            <span className="w-1/3 py-3">{guestFullName}</span>
            <span className="w-1/6 py-3 text-center">{guestTableNumber}</span>
            <div className="w-1/6 flex justify-end gap-x-3">
                <span className="cursor-pointer" onClick={openUpdateModal}>
                 <EditIcon />
                 {showUpdateModal && <UpdateModal guestId={guestId} guestFullname={guestFullName} guestTableNumber={guestTableNumber} closeModal={closeUpdateModal} refreshData={refreshData} />}
                </span>
                <span className="cursor-pointer" onClick={openDeleteModal}>
                    <DeleteOutlineIcon />
                    {showDeleteModal && <DeleteModal guestId={guestId} guestName={guestFullName} closeModal={closeDeleteModal} refreshData={refreshData} />}
                </span>
            </div>
         </div>
    )
}
export default GuestCard