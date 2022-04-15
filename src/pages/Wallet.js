import React from "react";
import { Card, Grid, Button, Modal, Box, TextField } from "@mui/material";
import btc from "../images/btc.svg";
import sol from "../images/sol.svg";
import eth from "../images/eth.svg";
import doge from "../images/doge.svg";
import usdc from "../images/usdc.svg";
import { GlobalContext } from "../utility/GlobalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
const data = [
  { coin: "btc", amount: "0.01", value: "$50", img: btc },
  { coin: "sol", amount: "0.01", value: "$20", img: sol },
  { coin: "eth", amount: "0.01", value: "$15", img: eth },
  { coin: "usdc", amount: "0.03", value: "$12", img: usdc },
];

const imageMap = { btc: btc, sol: sol, eth: eth, usdc: usdc };
export default function Wallet(props) {
  const [open, setOpen] = React.useState(false);
  const [wallet, setWallet] = React.useState("");
  const [withdrawHolding, setWithdrawHolding] = React.useState(null);
  const { state, setState } = React.useContext(GlobalContext);
  const [showLogin, setShowLogin] = React.useState(false);
  // const BASE_URL = "http://localhost:8080";
  // const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const BASE_URL = "https://api.blocksend.co";
  const [holdings, setHoldings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  let navigate = useNavigate();
  React.useEffect(() => {
    if (state.account &&state.account.id) {
      navigate("/admin")
    }
    getHoldings();
  }, [state.jwt]);

  const getHoldings = () => {
    if (props.fake) {
      setHoldings([
        { ticker: "eth", amount: 0.025, price: 30.53 },
        { ticker: "btc", amount: 0.025, price: 500.56 },
        { ticker: "sol", amount: 3, price: 150.19 },
      ]);
      return;
    }
    const headers = { Authorization: "bearer " + state.jwt };
    axios
      .get(BASE_URL + "/wallet", { headers: headers })
      .then((res) => {
        setHoldings(res.data);
        setShowLogin(false);
      })
      .catch((err) => {
        // navigate("/login");
        setShowLogin(true);
      });
  };

  const requestWithdraw = () => {
    if (props.fake) {
      return;
    }
    setLoading(true);
    const headers = { Authorization: "bearer " + state.jwt };
    axios
      .post(
        BASE_URL + "/transfer/withdraw",
        {
          ticker: withdrawHolding.ticker,
          amount: withdrawHolding.amount,
          address: wallet,
        },
        { headers: headers }
      )
      .then((res) => {
        alert("Withdraw request sent! You will receive an email!");
        setLoading(false);
        setOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Failed!");
      });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "75%",
    maxWidth: "300px",
    alignItems: "center",
    alignContent: "center",
    // display: 'flex',
    textAlign: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const logout = () => {
    setState({ jwt: "", user: {}, account: {}, currentUserId: null });
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_token_acc");
    navigate("/login")
  }

  if (showLogin) {
    return <Login />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1>My wallet</h1>
        <Button onClick={() => logout()}>Logout</Button>
      </Grid>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Enter your info</h3>
          <h3>
            <i>Fees will be subtracted</i>
          </h3>
          <TextField
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            id="outlined-basic"
            label="Wallet Address"
            variant="outlined"
            placeholder="0x123"
            style={{ marginBottom: 20 }}
          />
          <br></br>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <Button variant="contained" onClick={requestWithdraw}>
              Submit Withdraw Request
            </Button>
          )}
        </Box>
      </Modal>
      <Grid item md={3} xs={1} />
      <Grid container md={6} xs={10}>
        {holdings.map((r) => (
          <Grid item xs={12} md={6} lg={4}>
            <Card style={{ marginBottom: 20, height: 300 }}>
              <h3>{r.ticker.toUpperCase()}</h3>
              <img src={imageMap[r.ticker]} style={{ height: 50 }} />
              <h3>
                Amount: {r.amount.toFixed(5)} (${(r.price / 100).toFixed(2)})
              </h3>
              <Button
                style={{ marginBottom: 20 }}
                variant="contained"
                onClick={() => {
                  setOpen(true);
                  setWithdrawHolding(r);
                }}
              >
                Withdraw
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
