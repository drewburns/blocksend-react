import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../utility/GlobalContext";
import Send from "./Send";
import logo from "../images/logo.png"

export default function Admin() {
  const { state, setState } = React.useContext(GlobalContext);
  const [account, setAccount] = React.useState({});
  const [transfers, setTransfers] = React.useState([]);

  let navigate = useNavigate();
  const [receieverEmail, setReceiverEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  //   const BASE_URL = "http://localhost:8080";
  // const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const BASE_URL = "https://api.blocksend.co";
  React.useEffect(() => {
    const headers = { Authorization: `bearer ${state.jwt}` };
    axios
      .get(BASE_URL + "/admin", { headers: headers })
      .then((res) => {
        setAccount(res.data);
      })
      .catch((err) => {
        // handle 400 errors
        if (err.response.status === 403 || err.response.status === 401) {
          //   localStorage.removeItem("id_token_acc");
          //   setState({ jwt: null, account: {} });
          //   navigate("/adminLogin");
          //   alert("Login again");
        }
      });
    getTransfers();
  }, [state.jwt]);

  const getTransfers = () => {
    const headers = { Authorization: `bearer ${state.jwt}` };
    axios
      .get(BASE_URL + "/admin/transfers", { headers: headers })
      .then((res) => {
        setTransfers(res.data);
      })
      .catch((err) => {
        // handle 400 errors
        if (err.response.status === 403 || err.response.status === 401) {
          //   localStorage.removeItem("id_token_acc");
          //   setState({ jwt: null, account: {} });
          //   navigate("/adminLogin");
          //   alert("Login again");
        }
      });
  };
  const gridHeaders = (
    <React.Fragment>
      <Grid container>
        <Grid item xs={3}>
          <b>Date</b>
        </Grid>
        <Grid item xs={5}>
          <b> Description</b>
        </Grid>
        <Grid item xs={2}>
          <b>Amount</b>
        </Grid>
        <Grid item xs={2}>
          <b>Redeemed?</b>
        </Grid>
      </Grid>
    </React.Fragment>
  )

  const renderRow = (t) => {
    return (
      <Grid container style={{ height: 50, backgroundColor: "#E5F6DF", justifyContent: "center", display: 'flex', alignItems: "center" }}>
        <Grid item xs={3}>
          {new Date(t.createdAt).toLocaleDateString()}
        </Grid>
        <Grid item xs={5}>
          Transfer to {t.User.name} at {t.User.email}
        </Grid>
        <Grid item xs={2}>
          ${(t.amount / 100).toFixed(2)}
        </Grid>
        <Grid item xs={2}>
          {t.redeemedAt ? "✅" : "⏱"}
        </Grid>
        {/* <p>Link: app.blocksend.co/redeem/{t.link}</p> */}
      </Grid >)
  }
  const subtractBalance = (amount) => {
    getTransfers();
    setAccount({ ...account, balance: account.balance - amount });
  };

  const logout = () => {
    setState({ jwt: "", user: {}, account: {}, currentUserId: null });
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_token_acc");
    navigate("/login")
  }

  return (
    <div>
      <Grid container>
        <Grid item md={2}>
          <div style={{ marginTop: 50 }}>
            <img src={logo} style={{ height: 80 }} />
            <h2>{account.companyName}</h2>
          </div>
        </Grid>
        <Grid item md={8} xs={12} style={{marginTop: 40}}>
          <div style={{ textAlign: "left" }}>
            <h1>Financials</h1>
            <p>Contact the team at team@blocksend.co if any questions</p>
          </div>
          <Grid container>
            <Grid item xs={6} className="adminBlock">
              <h1>Send Crypto</h1>
              <Send subtractBalance={subtractBalance} />
            </Grid>
            <Grid item xs={6} className="adminBlock">
              <h3>Account Balance</h3>
              <div>
                <span style={{ fontWeight: "lighter", fontSize: 30 }}>$</span><span style={{ fontWeight: "bold", fontSize: 45 }}>{(account.balance / 100).toFixed(2)}</span>
                <a href="#" onClick={() => window.open('mailto:team@blocksend.co?subject=Account Funding&body=Hey there - I want to fund my account by x USD')}>
                  <p style={{color: '#333', textDecoration: 'none'}}>Fund account</p>
                </a>
                <p style={{ cursor: "pointer" }} onClick={() => logout()}>Logout</p>
              </div>
            </Grid>
            <Grid item xs={12} className="adminBlock">
              <h1 style={{ textAlign: "left" }}>Transfers</h1>
              {gridHeaders}
              {transfers.map((t) => (
                renderRow(t)
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
