import {
  Card,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Modal,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";
// import CurrencyInput from "react-currency-input-field";

import React from "react";
import btc from "../images/btc.svg";
import sol from "../images/sol.svg";
import eth from "../images/eth.svg";
import doge from "../images/doge.svg";
import usdc from "../images/usdc.svg";
import { GlobalContext } from "../utility/GlobalContext";

export default function Redeem(props) {
  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const location = window.location;
  const transferId = location.pathname.split("/")[2];
  // const [amount, setAmount] = React.useState(25.0);
  const [senderName, setSenderName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [coins, setCoins] = React.useState(() => ["btc", "eth"]);
  const [amounts, setAmounts] = React.useState({});
  const [transfer, setTransfer] = React.useState({});
  const [verifyCode, setVerifyCode] = React.useState("");
  const { state, setState } = React.useContext(GlobalContext);
  let navigate = useNavigate();

  React.useEffect(() => {
    if (!props.fake) {
      fetchTransfer();
    } else {
      setTransfer({ amount: 25 });
      setSenderName("BlockSend");
    }
  }, [state.jwt]);

  const fetchTransfer = () => {
    const headers = { Authorization: `bearer ${state.jwt}` };
    axios
      .get(BASE_URL + "/transfer/find/" + transferId, { headers: headers })
      .then((res) => {
        console.log("data", res.data);
        setTransfer(res.data.transfer);
        setSenderName(res.data.senderName);
        // setVerifyCode(res.data.code);
        if (res.data.transfer.redeemedAt) {
          alert("already redeemed");
          navigate("/");
        }
      })
      .catch((err) => {
        alert("transfer doesnt exist");
        navigate("/");
      });
  };

  const remaining = () => {
    if (Object.values(amounts).length === 0) {
      return transfer.amount;
    }
    return (
      transfer.amount -
      Object.values(amounts).reduce((a, b) => parseFloat(a) + parseFloat(b))
    );
  };
  const handleCoins = (event, newFormats) => {
    setCoins(newFormats);
  };
  const updateAmounts = (newValue, coin) => {
    const newAmounts = { ...amounts };
    newAmounts[coin] = newValue;
    setAmounts(newAmounts);
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
    if (pickedAmount < transfer.amount) {
      data.push({
        title: "unpicked",
        value: transfer.amount - pickedAmount,
        color: "gray",
      });
    }
    return data;
  };
  const goToWallet = () => {
    if (props.fake) {
      navigate('/mock/wallet')
      return;
    }
    if (!state.jwt) {
      console.log("state: ", state);
      sendCode();
      setOpen(true);
      return;
    }
    saveCoins(state.jwt);
    // navigate("/wallet");
  };

  const sendCode = () => {
    axios
      .post(BASE_URL + "/auth/code", { transferId: transfer.id })
      .then((res) => {})
      .catch((err) => {
        alert("wrong email!");
      });
  };

  const saveCoins = (token) => {
    const headers = { Authorization: `bearer ${token}` };
    console.log("headers", headers);
    axios
      .post(
        BASE_URL + "/transfer/confirm/" + transferId,
        { coins: amounts },
        { headers: headers }
      )
      .then((res) => {
        navigate("/wallet");
      })
      .catch((err) => {
        alert("not saved");
      });
  };

  const tryLogin = () => {
    axios
      .post(BASE_URL + "/auth/login", { userId: transfer.userId, verifyCode })
      .then((res) => {
        setState({ jwt: res.data.token, user: res.data.user });
        localStorage.setItem("id_token", res.data.token);
        saveCoins(res.data.token);
      })
      .catch((err) => {
        alert("wrong code!");
      });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Verify code sent to email</h3>
          <h3>Your code is: {}</h3>
          <TextField
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            id="outlined-basic"
            label="Verify Code"
            variant="outlined"
            placeholder="123456"
          />
          <br></br>
          <Button variant="contained" onClick={tryLogin}>
            Confirm splits
          </Button>
        </Box>
      </Modal>
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Card>
            <h3>
              {senderName} sent you ${transfer.amount}!
            </h3>
            <p>
              <i>Pick the coins you'd like!</i>
            </p>

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
                  totalValue={transfer.amount}
                />
              </div>
              <div>
                {coins.map((c) => (
                  <div>
                    {" "}
                    <TextField
                      type="number"
                      // value={amount}
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
            </div>
            <div className="formBlock">
              <Button variant="contained" onClick={goToWallet}>
                Confirm splits
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
