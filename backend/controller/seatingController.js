const { db } = require('../config/dbConnection.js')

//@desc get all guest names and table numbers
//@route GET api/guests
//@access Public
const getAllGuests = (req, res) => {
    //query for getting all guests
    const query = "SELECT * FROM guests";

    //execute sql query to get all guests
    db.query(query, (err, result) => {
        if (err){
            console.error({"error": `get all guest from DB error: ${err} `})
            return res.status(500).json({ "error": "Server error" });
        }
        //validate guests have been found
        if(result.length === 0){
            console.log({ "message": "no guests found"});
            return res.status(404).json({ error: "No Guests Found." })            
        }
        console.log({"message": `All guests found. Guest count: ${result.length}`});
        return res.status(200).json({"allGuests": result, "guestCount": result.length});
      });
}

//@desc get seating information for searched input
//@route GET api/guests/:id
//@access Public
const getGuest = (req, res) => {

    //get id from request params. (PS. dont use req.body for get methods.)
    const id = req.params.id;
    //validate id
    if (!id || isNaN(id)){return res.status(400).json({ "error": "invalid id from params."})}
    
    //query for getting seating chart
    const query = "SELECT * FROM guests WHERE `guest_id` = ?";
        
    //execute sql query to get guest information
    db.query(query, [id], (err, result) => {
        if(err){
            console.error({"error": `get guest from DB error: ${err} `})
            return res.status(500).json({"error": "error fetching guest from DB"});
        }
        //validate guest is found or not.
        if (result.length === 0) {
            console.error({"error": `Guest not found at id: ${id}` });
            return res.status(404).json({ "error": "Guest not found." });
        }
        console.log(result);
        return res.status(200).json({ "message":"Guest found.", "foundGuest": result });
    })  
}
//@desc adding new guest to guest list.
//@route POST api/guests/:id
//@access Public
const addGuest = (req, res) => {
    //destructure data coming from frontend from request body
    const { fullName, tableNumber } = req.body;

    //validate data coming from frontend
    if(!fullName || !tableNumber){ return res.status(400).json({ "error": "Invalid name or table number." })}

    //check if user alreadys exists in db.
    const queryFind = "SELECT * FROM guests WHERE `guest_name` = ?"
    db.query(queryFind, [fullName], (err, findResult) =>{
        if(err){
            console.error({"error": `find guest from DB error: ${err} `})
            return res.status(500).json({"error": "error finding guest from DB"});
        }
        if(findResult.length != 0){
            console.error({"error": "Failed to insert. Guest already exists." })
            return res.status(409).json({ "error": "Guest already exists", "guest":findResult})
        }

         //query to insert new guest
        const query = "INSERT INTO guests (`guest_name`,`table_number`) VALUES (?,?)";
        db.query(query, [fullName, tableNumber], (err, result) => {
            if(err){ 
                console.error({"error": `failed to insert guest: ${err} `})
                return res.status(500).json({ "error": "error inserting guest into database." });
            } 
            console.log({ "message": `Guest ${fullName} added at table number ${tableNumber}.`})
            return res.status(200).json({ "message": `Guest ${fullName} added at table number ${tableNumber}.` });
        })
    })
}

//@desc update name or table number for specified guest.
//@route PUT api/guests/:id
//@access Public
const updateGuest = (req, res) => {
    //get id from request params and destructure req.body.
    const id = req.params.id;
    const { fullName, tableNumber } = req.body;

    //validate id and req.body
    if (!id || isNaN(id)){return res.status(400).json({ "error": "invalid id."})}
    if(!fullName || !tableNumber || isNaN(tableNumber)){ return res.status(400).json({ "error": "invalid name or table number." })}
    
    //find guest before updating
    const queryFind = "SELECT * FROM guests WHERE `guest_id` = ?";
            
    //execute sql query to get guest information
    db.query(queryFind, [id], (err, result) => {
        if(err){
            console.error("fetch guest from DB error: ", err);
            return res.status(500).json({"error": "error fetching guest from DB"});
        }
        //validate guest is found or not.
        if (result.length === 0) {
            console.error({"error": `Failed to update, guest not found at id: ${id}`});
            return res.status(404).json({ "error": "Guest not found." });
        }
         //sql query for updating guest
        const queryGuest= "UPDATE guests SET `guest_name` = (?), `table_number` = (?) WHERE `guest_id` = (?)"

        //execute sql query
        db.query(queryGuest,[fullName, tableNumber, id],(err, result) => {
            if(err){
                console.error("error updating user in db:",err)
                return res.status(500).json({ "error": "error connecting to database"})
            }
            console.log({"message": `Guest ${fullName}, with id ${id} updated.` })
            return res.status(200).json({"message": "Guest updated."})
        })
    })
}

//@desc delete guest from guest list.
//@route DELETE api/guests/:id
//@access Public
const deleteGuest = (req, res) => {
     //get id from request params and destructure req.body.
    const id = req.params.id;

    //validate id, name, table number
    if (!id || isNaN(id)){return res.status(400).json({ "error": "invalid id."})}

    //sql query find guest
    const queryFind = "SELECT * FROM guests WHERE `guest_id` = ?";
    db.query(queryFind, [id], (err, resultGuest) => {
        if(err){
            console.log("fetch guest from DB error: ", err)
            return res.status(500).json({"error": "error fetching guest from DB"});
        }
        //check if guest is found or not.
        if(resultGuest.length === 0) {
            console.error({"error": `Failed to delete, guest not found at id: ${id}`});
            return res.status(404).json({ "error": "Guest not found." });
        }
        //sql query delete guest
        const queryDelete = "DELETE FROM guests WHERE `guest_id` = ?"
        db.query(queryDelete, [id], (err, result) => {
            if(err){
                console.error({"error":`error deleting user from db: ${err}`});
                return res.status(500).json({ message: "server error deleting guest." });
            }
            console.log({ "message": `guest with id: ${id} deleted.`});
            return res.status(200).json({ "message": "Guest Deleted.", "deletedGuest": resultGuest })
        })
    })  
}


module.exports = { getAllGuests, getGuest, addGuest, updateGuest, deleteGuest};