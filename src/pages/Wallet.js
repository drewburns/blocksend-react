import React from "react";
import { Card, Grid, Button } from "@mui/material";
import btc from "../images/btc.svg";
import sol from "../images/sol.svg";
import eth from "../images/eth.svg";
import doge from "../images/doge.svg";
import usdc from "../images/usdc.svg";
import { GlobalContext } from "../utility/GlobalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const data = [
  { coin: "btc", amount: "0.01", value: "$50", img: btc },
  { coin: "sol", amount: "0.01", value: "$20", img: sol },
  { coin: "eth", amount: "0.01", value: "$15", img: eth },
  { coin: "usdc", amount: "0.03", value: "$12", img: usdc },
];

const imageMap = { btc: btc, sol: sol, eth: eth, usdc: usdc };
export default function Wallet() {
  const { state, setState } = React.useContext(GlobalContext);
  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://fathomless-ravine-95441.herokuapp.com";
  const [holdings, setHoldings] = React.useState([]);
  let navigate = useNavigate();
  React.useEffect(() => {
    getHoldings();
  }, [state.jwt]);

  const getCoinPrice = async (ticker) => {
    const coinMapping = {
      btc: "bitcoin",
      eth: "ethereum",
      doge: "dogecoin",
      sol: "solana",
    };
    if (ticker === "usdc") {
      return 1.0;
    }
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinMapping[ticker]}`
    );
    console.log("coin price: ", ticker, res.data[0].current_price);
    return res.data[0].current_price;
  };

  const getHoldings = () => {
    const headers = { Authorization: "bearer " + state.jwt };
    axios
      .get(BASE_URL + "/wallet", { headers: headers })
      .then((res) => {
        setHoldings(res.data);
      })
      .catch((err) => {
        navigate("/login");
      });
  };
  return (
    <Grid container>
      <Grid item xs={3} />
      <Grid container xs={6}>
        {holdings.map((r) => (
          <Grid item xs={4}>
            <Card style={{ marginBottom: 20 }}>
              <h3>{r.ticker.toUpperCase()}</h3>
              <img src={imageMap[r.ticker]} style={{ height: 50 }} />
              <h3>
                Amount: {r.amount} (${r.price})
              </h3>
              <Button style={{ marginBottom: 20 }} variant="contained">
                Withdraw
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
