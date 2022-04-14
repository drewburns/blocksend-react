import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../utility/GlobalContext";
import Send from "./Send";

export default function Admin() {
  const { state, setState } = React.useContext(GlobalContext);
  const [account, setAccount] = React.useState({});
  const [transfers, setTransfers] = React.useState([]);

  let navigate = useNavigate();
  const [receieverEmail, setReceiverEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const BASE_URL = "http://localhost:8080";
  // const BASE_URL = "https://blocksend-dev.herokuapp.com";

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
          localStorage.removeItem("id_token_acc");
          setState({ jwt: null, account: {} });
          navigate("/adminLogin");
          alert("Login again");
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
          localStorage.removeItem("id_token_acc");
          setState({ jwt: null, account: {} });
          navigate("/adminLogin");
          alert("Login again");
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
        <Grid item md={1}></Grid>
        <Grid item md={10} xs={12}>
          <Grid container>
            <Grid item xs={6} className="adminBlock">
              <Card>
                <h3>Send</h3>
                <Send subtractBalance={subtractBalance} />
              </Card>
            </Grid>
            <Grid item xs={6} className="adminBlock">
              <Card>
                <h3>Transfers</h3>
                {transfers.map((t) => (
                  <div>
                    <p>
                      Sent {t.User.name} ${(t.amount / 100).toFixed(2)}
                    </p>
                    <p>Email: {t.User.email}</p>
                    <p>Link: sandbox.blocksend.co/redeem/{t.link}</p>
                    <p>{t.redeemedAt ? "Redeemed" : "Not Redeemed"}</p>
                    <hr></hr>
                  </div>
                ))}
              </Card>
            </Grid>
            <Grid item xs={6} className="adminBlock">
              <Card>
                <h3>Account</h3>
                <h4>Company name: {account.companyName}</h4>
                <h4>Current Balance: ${(account.balance / 100).toFixed(2)}</h4>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
