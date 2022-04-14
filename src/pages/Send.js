import { Card, TextField, Button, Modal, Grid } from "@mui/material";
// import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../utility/GlobalContext";
import Checkout from "./Checkout";

export default function Send(props) {
  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://fathomless-ravine-95441.herokuapp.com";
  let navigate = useNavigate();
  const [amount, setAmount] = React.useState(25.0);
  const [email, setEmail] = React.useState("");
  const [receiverName, setReceiverName] = React.useState("");
  const [transferLink, setTransferLink] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  const { state, setState } = React.useContext(GlobalContext);
  const restart = () => {
    setAmount(25.0);
    setEmail("");
    setTransferLink("");
    setReceiverName("");
  };
  const sendCrypto = () => {
    setLoading(true);
    // if (!state.jwt) {
    //   console.log("state: ", state);
    //   setOpen(true);
    //   return;
    // }
    const headers = { Authorization: "bearer " + state.jwt };
    axios
      .post(
        BASE_URL + "/transfer/create",
        { email, amount, receiverName },
        { headers: headers }
      )
      .then((res) => {
        console.log("res: ", res.data);
        setTransferLink(res.data.link);
        props.subtractBalance(amount * 100);
        setLoading(false);
      })
      .catch((err) => {
        alert("Error! Contact support");
        setLoading(false);
        if (err.response.status === 403 || err.response.status === 401) {
          navigate("/adminLogin");
          setState({ jwt: null, account: {} });
          localStorage.removeItem("id_token_acc");
          alert("Login again");
        }
      });
  };

  if (transferLink) {
    return (
      <Card>
        <h3>Success! Sent to {email}</h3>
        <p>
          <i style={{ marginBottom: 30 }}>
            Link: https://blocksend.co/redeem/{transferLink}
          </i>
        </p>
        <Button variant="contained" onClick={() => restart()}>
          Restart
        </Button>
      </Card>
    );
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <h3>
          <i>Subject to gas and tx fees</i>
        </h3>
        <div className="formBlock">
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.round(e.target.value * 100) / 100)}
            id="outlined-basic"
            label="Amount (USD)"
            variant="outlined"
            placeholder="25.00"
          />
        </div>
        <div className="formBlock">
          <TextField
            type="email"
            value={email}
            placeholder="joe@smith.com"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            label="Receiver Email or Phone"
            variant="outlined"
          />
        </div>
        <div className="formBlock">
          <TextField
            type="name"
            value={receiverName}
            placeholder="Their name"
            id="email"
            onChange={(e) => setReceiverName(e.target.value)}
            label="Their name"
            variant="outlined"
          />
        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="formBlock">
            {email && amount && receiverName ? (
              <Button variant="contained" onClick={() => sendCrypto()}>
                Send
              </Button>
            ) : (
              <h3>Please fill out all fields</h3>
            )}
          </div>
        )}
      </Grid>
    </Grid>
  );
}
