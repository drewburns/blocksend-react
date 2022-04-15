import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
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

  const subtractBalance = (amount) => {
    getTransfers();
    setAccount({ ...account, balance: account.balance - amount });
  };
  return (
    <div>
      <Grid container>
        <Grid item md={2}>
          <div style={{ marginTop: 50 }}>
            <img src={logo} style={{ height: 80 }} />
            <h2>{account.companyName}</h2>
          </div>
        </Grid>
        <Grid item md={8} xs={12}>
          <div style={{ textAlign: "left" }}>
            <h1>Finanicals</h1>
            <p>We're standing by to help. Contact the team at team@blocksend.co</p>
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
                <p style={{ cursor: "pointer" }}>Fund account</p>
              </div>
            </Grid>
            <Grid item xs={12} className="adminBlock">
              <Card>
                <h3>Transfers</h3>
                {transfers.map((t) => (
                  <div>
                    <p>
                      Sent {t.User.name} ${(t.amount / 100).toFixed(2)}
                    </p>
                    <p>Email: {t.User.email}</p>
                    <p>Link: app.blocksend.co/redeem/{t.link}</p>
                    <p>{t.redeemedAt ? "Redeemed" : "Not Redeemed"}</p>
                    <hr></hr>
                  </div>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
