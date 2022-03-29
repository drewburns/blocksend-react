import React from "react";
import Send from "./pages/Send";
import "./App.css";
import { Grid, Button, Alert } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Redeem from "./pages/Redeem";
import Wallet from "./pages/Wallet";
import Widget from "./pages/Widget";
import { GlobalContext } from "./utility/GlobalContext";
import Login from "./pages/Login";

function App() {
  const navigate = useNavigate();
  const { state, setState } = React.useContext(GlobalContext);
  return (
    <Routes>
      <Alert severity="warning">Test Mode, not real money!</Alert>
      <div className="App">
        <h1>BlockSend</h1>
        <h3>
          <i>Send USD. They pick the coins. </i>
        </h3>
        <Button onClick={() => navigate("/wallet")}>View my wallet</Button>
        {state.jwt && <p>Logged in as {state.user.email}</p>}
        <Route exact path="/" element={<Wallet />} />
        <Route path="/redeem/:id" element={<Redeem />} />
        <Route path="/mock/wallet" element={<Wallet fake />} />
        <Route path="/mock/redeem" element={<Redeem fake />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/login" element={<Login />} />
      </div>
      <Route path="/mock/widget" element={<Widget fake />} />
    </Routes>
  );
}

export default App;
