import React from "react";
import Send from "./pages/Send";
import "./App.css";
import { Grid, Button, Alert } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Redeem from "./pages/Redeem";
import Wallet from "./pages/Wallet";
import { GlobalContext } from "./utility/GlobalContext";
import Login from "./pages/Login";

function App() {
  const navigate = useNavigate();
  const { state, setState } = React.useContext(GlobalContext);
  return (
    <div className="App">
      {/* <Alert severity="warning">Test Mode, not real money!</Alert> */}

      <h1>BlockSend</h1>
      <h3>
        <i>Send USD. They pick the coins. </i>
      </h3>
      <Button onClick={() => navigate("/wallet")}>View my wallet</Button>
      <Button onClick={() => navigate("/")}>Create new send</Button>
      {state.jwt && <p>Logged in as {state.user.email}</p>}
      {/* <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}></Grid>
      </Grid> */}

      <Routes>
        <Route exact path="/" element={<Send />} />
        <Route path="/redeem/:id" element={<Redeem />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
