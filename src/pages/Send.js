import { Card, TextField, Button, Modal, Grid } from "@mui/material";
// import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import React from "react";
import { GlobalContext } from "../utility/GlobalContext";
import Checkout from "./Checkout";

export default function Send() {
  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://fathomless-ravine-95441.herokuapp.com";
  const [amount, setAmount] = React.useState(25.0);
  const [email, setEmail] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [transferLink, setTransferLink] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  const { state, useState } = React.useContext(GlobalContext);
  const sendCrypto = (paymentId) => {
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
        { email, amount, senderName, paymentId  },
        { headers: headers }
      )
      .then((res) => {
        console.log("res: ", res.data);
        setTransferLink(res.data.link);
        setLoading(false);
      })
      .catch((err) => {
        alert("Error! Contact support");
        setLoading(false);
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
      </Card>
    );
  }
  return (
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Card className="sendBlock">
          <h3>Send</h3>
          <div className="formBlock">
            <TextField
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(Math.round(e.target.value * 100) / 100)
              }
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
              label="Receiver Email"
              variant="outlined"
            />
          </div>
          <div className="formBlock">
            <TextField
              type="name"
              value={senderName}
              placeholder="Your name"
              id="email"
              onChange={(e) => setSenderName(e.target.value)}
              label="Your name"
              variant="outlined"
            />
          </div>

          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <div className="formBlock">
              {email && amount && senderName ? (
                <Checkout amount={amount} sendCrypto={sendCrypto} />
              ) : (
                <h3>Please fill out all fields</h3>
              )}
              {/* <Button
                variant="contained"
                disabled={!email || !amount || !senderName}
                onClick={sendCrypto}
              >
                Pay ${amount} and send!
              </Button> */}
            </div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}
