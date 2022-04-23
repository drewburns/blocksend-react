import { Grid } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import headerImage from "../images/loginheader.png"
import Login from './Login';

export default function Giveaway() {
    let navigate = useNavigate();
    const [amountLeft, setAmountLeft] = React.useState(0)
    React.useEffect(() => {
        getBalanceLeft()
    }, [])

    const getBalanceLeft = () => {
        axios.get("https://api.blocksend.co/transfer/amountLeft").then((res) => {
            setAmountLeft(res.data)
        })
    }

    const tryToRedeem = (jwt) => {
        const headers = { Authorization: `bearer ${jwt}` };
        axios.post("https://api.blocksend.co/transfer/claim", {}, { headers: headers }).then((res) => {
            navigate(`/redeem/${res.data}`)
        }).catch(err => {
            alert("Problem redeeming")
        })
    }

    return (
        <Grid container>
            {/* <Login /> */}
            <Grid item md={3} xs={1} />
            <Grid item md={6} xs={10} style={{ justifyContent: "center", alignContent: "center" }}>
                <img src={headerImage} style={{ height: 140, marginTop: 30 }} />
                <h3 style={{ fontSize: 25, marginTop: 30 }}>Blocksend YC Giveaway</h3>
                {/* <h3>Amount Left: ${(amountLeft / 100).toFixed()}</h3> */}
                <hr></hr>
                <h2>Claim my $10!</h2>
            </Grid>

            <Login hideHeader admin={false} tryToRedeem={tryToRedeem} />
        </Grid>

    )
}