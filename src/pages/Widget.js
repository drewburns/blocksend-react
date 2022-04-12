import React from "react";
import {
  Card,
  Grid,
  Button,
  Modal,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PieChart } from "react-minimal-pie-chart";
import btc from "../images/btc.svg";
import sol from "../images/sol.svg";
import eth from "../images/eth.svg";
import doge from "../images/doge.svg";
import usdc from "../images/usdc.svg";
const BASE_URL = "https://blocksend-dev.herokuapp.com";
// const BASE_URL = "http://localhost:8080";
export default function Widget() {
  const style = {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    width: 300,
    minHeight: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [phase, setPhase] = React.useState("start");
  const [email, setEmail] = React.useState("");
  const [coins, setCoins] = React.useState(() => ["usdc"]);
  const [amounts, setAmounts] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleCoins = (event, newFormats) => {
    setCoins(newFormats);
  };
  const updateAmounts = (newValue, coin) => {
    const newAmounts = { ...amounts };
    newAmounts[coin] = newValue * 100;
    setAmounts(newAmounts);
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const setNewPhase = async (newPhase) => {
    setLoading(true);
    await delay(1000);
    // setLoading(true);
    // setTimeout(function () {
    setPhase(newPhase);
    setLoading(false);
    // }, 1000);
  };
  const sendFakeEmail = () => {
    axios
      .post(BASE_URL + "/transfer/mockEmail", { coins: amounts, email })
      .then((res) => {
        // navigate("/wallet");
      })
      .catch((err) => {
        console.log(err);
        // alert("not saved");
      });
  };

  const startScreen = (
    <React.Fragment>
      <h1 style={{ margin: 0, fontSize: 50 }}>$120.00</h1>
      <p>Balance</p>
      <ClipLoader color={"black"} loading={loading} size={75} />
      <Button
        style={{
          fontSize: "17px",
          color: "white",
          height: 60,
          backgroundColor: "#FD7F0C",
          marginTop: 40,
          fontWeight: "bold",
        }}
        variant="contained"
        fullWidth
        onClick={() => setNewPhase("payout")}
      >
        Payout with BlockSend
      </Button>
    </React.Fragment>
  );

  const payoutScreen = (
    <React.Fragment>
      <h1 style={{ margin: 0 }}>$120.00</h1>
      <h3>Withdraw in: {coins.map((c) => c.toUpperCase()).join(", ")}</h3>
      <i style={{ fontWeight: "lighter" }}>2.5% will be used for transaction</i>
      <b>
        <p>Will be deposited in your account instantly</p>
      </b>
      <TextField
        type="text"
        fullWidth
        // value={verifyCode}
        placeholder="Your wallet, email, or phone number"
        // id="verifyCode"
        onChange={(e) => setEmail(e.target.value)}
        label="Wallet, email, or phone number"
        variant="outlined"
      />
      <ClipLoader color={"black"} loading={loading} size={75} />
      <Button
        style={{
          fontSize: "17px",
          color: "white",
          height: 60,
          backgroundColor: "#FD7F0C",
          marginTop: 30,
          fontWeight: "bold",
        }}
        variant="contained"
        fullWidth
        onClick={() => {
          setNewPhase("paid");
          sendFakeEmail();
        }}
      >
        Confirm
      </Button>

      <Button
        fullWidth
        style={{ marginTop: 30, color: "black" }}
        onClick={() => setPhase("pickCoins")}
      >
        Select Currency
      </Button>
    </React.Fragment>
  );

  const paidScreen = (
    <React.Fragment>
      <h2 style={{ margin: 0 }}>
        You were paid $120.00 in {coins.map((c) => c.toUpperCase()).join(", ")}{" "}
      </h2>
      <CheckCircleIcon
        style={{ fontSize: 75, marginTop: 20, color: "green" }}
      />
      <Button
        style={{
          fontSize: "17px",
          color: "white",
          height: 60,
          fontWeight: "bold",
          backgroundColor: "#FD7F0C",
          marginTop: 30,
        }}
        variant="contained"
        fullWidth
        onClick={() => setPhase("start")}
      >
        Restart
      </Button>
    </React.Fragment>
  );

  const remaining = () => {
    if (Object.values(amounts).length === 0) {
      return (12000 / 100).toFixed(2);
    }
    const amount = 12000 - Object.values(amounts).reduce((a, b) => a + b);
    return (amount / 100).toFixed(2);
  };

  const getData = () => {
    const data = [];
    const colors = {
      btc: "orange",
      eth: "blue",
      sol: "cyan",
      doge: "gold",
      usdc: "green",
    };
    let pickedAmount = 0;
    coins.forEach((c) => {
      pickedAmount += parseFloat(amounts[c]) || 0;
      data.push({
        title: c,
        value: parseFloat(amounts[c]) || 0,
        color: colors[c],
      });
    });
    if (pickedAmount < 120) {
      data.push({
        title: "unpicked",
        value: 120 - pickedAmount,
        color: "gray",
      });
    }
    return data;
  };

  const pickCoins = (
    <React.Fragment>
      <h2 style={{ marginTop: 0, paddingTop: 0 }}>Pick your coins</h2>
      <h4>Total: $120.00 USD</h4>
      <ClipLoader color={"black"} loading={loading} size={75} />
      <div className="formBlock">
        <ToggleButtonGroup
          value={coins}
          onChange={handleCoins}
          aria-label="text formatting"
        >
          <ToggleButton value="usdc" aria-label="bold">
            {/* <Icon name="usdc" size={25} /> */}
            <img src={usdc} style={{ height: 40 }} />
          </ToggleButton>
          <ToggleButton value="btc" aria-label="bold">
            {/* <Icon name="usdc" size={25} /> */}
            <img src={btc} style={{ height: 40 }} />
          </ToggleButton>
          <ToggleButton value="eth" aria-label="italic">
            <img src={eth} style={{ height: 40 }} />
          </ToggleButton>
          <ToggleButton value="sol" aria-label="underlined">
            <img src={sol} style={{ height: 40 }} />
          </ToggleButton>
          <ToggleButton value="doge" aria-label="color">
            <img src={doge} style={{ height: 40 }} />
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="formBlock">
          <PieChart
            style={{ height: 100 }}
            data={getData()}
            totalValue={12000}
          />
        </div>
        <div>
          {coins.map((c) => (
            <div>
              {" "}
              <TextField
                type="number"
                // value={(amounts[c] / 100).toFixed(2)}
                onChange={(e) => updateAmounts(e.target.value, c)}
                id="outlined-basic"
                label={`Amount of ${c.toUpperCase()}`}
                variant="outlined"
                placeholder="25.00"
              />
            </div>
          ))}
          <i>Remaining: ${remaining()}</i>
          {/* <i>Remaining: ${Object.values(amounts).reduce((a, b) => a + b)}</i> */}
        </div>
        <Button
          style={{
            fontSize: "17px",
            color: "white",
            height: 60,
            fontWeight: "bold",
            backgroundColor: "#FD7F0C",
            marginTop: 30,
          }}
          variant="contained"
          fullWidth
          onClick={() => setPhase("payout")}
        >
          Back
        </Button>
      </div>
    </React.Fragment>
  );

  return (
    <Grid container style={{ textAlign: "center", marginTop: 50 }}>
      <Grid item xs={1} md={4} />
      <Grid
        item
        xs={10}
        md={4}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
        }}
      >
        <Box sx={style}>
          {phase === "start" && startScreen}
          {phase === "payout" && payoutScreen}
          {phase === "paid" && paidScreen}
          {phase === "pickCoins" && pickCoins}
        </Box>
      </Grid>
    </Grid>
  );
}
