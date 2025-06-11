const express = require('express')
const { getAllGuests, getGuest, addGuest, updateGuest, deleteGuest } = require('../controller/seatingController')
const router = express.Router()

router.route("/").get(getAllGuests) //get seating for all guests

router.route("/:id").get(getGuest) //get seating for searched input.

router.route("/").post(addGuest) //add new guest to seating table

router.route("/:id").put(updateGuest) //update name or table number for guest

router.route("/:id").delete(deleteGuest) //delete guest

module.exports = router;