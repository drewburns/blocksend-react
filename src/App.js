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
import Admin from "./pages/Admin";
import Giveaway from "./pages/Giveaway";

function App() {
  const navigate = useNavigate();
  const { state, setState } = React.useContext(GlobalContext);
  // if (window.location.pathname === "/mock/widget") {
  //   return <Widget fake />;
  // }

  const logout = () => {
    setState({ jwt: "", user: {}, account: {}, currentUserId: null });
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_token_acc");
    navigate("/login")
  };

  const getButtonLabel = () => {
    if (state.jwt) {
      if (state.account && state.account.id) {
        return "Admin Home";
      }
      return "View my wallet";
    } else {
      return "Login to Wallet";
    }
  };

  const getDestination = () => {
    if (state.jwt) {
      if (state.account && state.account.id) {
        navigate("/admin");
        return;
      }
      navigate("/wallet");
      return;
    }
    navigate("/wallet");
  };
  return (
    <div className="App">

      <Routes>
        <Route exact path="/" element={<Wallet />} />
        <Route exact path="/ycgiveaway" element={<Giveaway />} />
        <Route path="/redeem/:id" element={<Redeem />} />
        {/* <Route path="/demo/wallet" element={<Wallet fake />} /> */}
        {/* <Route path="/demo/redeem" element={<Redeem fake />} /> */}
        {/* <Route path="/demo/widget" element={<Widget fake />} /> */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<Login admin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;


// {window.location.pathname !== "/demo/widget" && (
//   <React.Fragment>
//     {/* <h1>BlockSend</h1> */}
//     <Button onClick={() => getDestination()}>{getButtonLabel()}</Button>
//     {!state.jwt && (
//       <Button onClick={() => navigate("/adminLogin")}>Admin Login</Button>
//     )}
//     {state.jwt && <Button onClick={() => logout()}>Logout</Button>}
//     {/* {state.jwt && <p>Logged in as {state.user.email}</p>} */}
//   </React.Fragment>
// )}