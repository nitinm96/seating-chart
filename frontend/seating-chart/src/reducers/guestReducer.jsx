export const ACTION_TYPES = {
  SET_GUEST_DATA: "SET_GUEST_DATA",
  GET_GUEST_ADDED: "GET_GUEST_ADDED",
  GET_GUEST_UPDATED: "GET_GUEST_UPDATED",
  GET_GUEST_DELETED: "GET_GUEST_DELETED",
  GET_ERROR: "GET_ERROR",
  RESET: "RESET",
};

export const INITIAL_STATE = {
  guestName: "",
  tableNumber: "",
  guestAdded: false,
  guestUpdated: false,
  guestDeleted: false,
  successMessage: "",
  error: false,
  errorMessage: "",
};

export const guestReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_GUEST_DATA:
      return {
        ...state,
        guestName: action.payload.guestName,
        tableNumber: action.payload.tableNumber,
      };
    case ACTION_TYPES.GET_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: action.payload.error,
      };
    case ACTION_TYPES.GET_GUEST_ADDED:
      return {
        ...state,
        guestAdded: true,
        successMessage: `Guest added successfully`,
      };
    case ACTION_TYPES.GET_GUEST_UPDATED:
      return {
        ...state,
        guestUpdated: true,
        successMessage: `Guest updated successfully`,
      };
    case ACTION_TYPES.GET_GUEST_DELETED:
      return {
        ...state,
        guestDeleted: true,
        successMessage: `Guest deleted successfully`,
      };
    case ACTION_TYPES.RESET:
      return {
        state,
      };
    default:
      return {
        state,
      };
  }
};
