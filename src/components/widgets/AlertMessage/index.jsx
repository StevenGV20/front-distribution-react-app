import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../redux/features/utils/utilsSlice";

const AlertMessage = () => {
  const messageView = useSelector((state) => state.utilsState.message);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      dispatch(
        setMessage({
          state: false,
          message: "",
          type: "",
        })
      );
      return;
    }
    dispatch(
      setMessage({
        state: false,
        message: "",
        type: "",
      })
    );
  };

  return (
    <>
      <div className="desktop">
        <Snackbar
          open={messageView.state}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={messageView.type || "success"}
            variant="filled"
            sx={{
              width: "100%",
              scale: "1.2",
              marginLeft: "1em",
              zIndex: "1000000",
            }}
          >
            {messageView.message}
          </Alert>
        </Snackbar>
      </div>
      <div className="mobile">
        <Snackbar
          open={messageView.state}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={messageView.type || "success"}
            variant="filled"
            sx={{
              width: "100%",
              scale: "1",
              marginLeft: "1em",
              zIndex: "1000000",
            }}
          >
            {messageView.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default AlertMessage;
