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
  // if (window.location.pathname === "/mock/widget") {
  //   return <Widget fake />;
  // }

  return (
    <div className="App">
      {/* <Alert severity="warning">Test Mode, not real money!</Alert> */}

      {window.location.pathname !== "/demo/widget" && (
        <React.Fragment>
          <h1>BlockSend</h1>
          <Button onClick={() => navigate("/wallet")}>
            {state.jwt ? "View my wallet" : "Login to Wallet"}
          </Button>
          {state.jwt && <p>Logged in as {state.user.email}</p>}
        </React.Fragment>
      )}
      {/* <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}></Grid>
      </Grid> */}

      <Routes>
        <Route exact path="/" element={<Wallet />} />
        <Route path="/redeem/:id" element={<Redeem />} />
        {/* <Route path="/demo/wallet" element={<Wallet fake />} /> */}
        {/* <Route path="/demo/redeem" element={<Redeem fake />} /> */}
        {/* <Route path="/demo/widget" element={<Widget fake />} /> */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
