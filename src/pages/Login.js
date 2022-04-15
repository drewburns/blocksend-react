import React from "react";
import { Card, Grid, Button, TextField } from "@mui/material";
import axios from "axios";
import { GlobalContext } from "../utility/GlobalContext";
import { useNavigate } from "react-router-dom";
import headerImage from "../images/loginheader.png"
export default function Login(props) {
  // const BASE_URL = "http://localhost:8080";
  // const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const BASE_URL = "https://api.blocksend.co";
  const [email, setEmail] = React.useState("");
  const [verifyCode, setVerifyCode] = React.useState("");
  const [codeSent, setCodeSent] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { state, setState } = React.useContext(GlobalContext);
  let navigate = useNavigate();
  const ISADMIN = props.admin;

  const sendCode = () => {
    setLoading(true);
    const url = ISADMIN ? "/auth/admin/code" : "/auth/code";
    axios
      .post(BASE_URL + url, { email })
      .then((res) => {
        setCodeSent(true);
        setUserId(res.data.userId || res.data.accountId);
        setLoading(false);
      })
      .catch((err) => {
        alert("wrong email!");
        setLoading(false);
        setCodeSent(false);
        setEmail("");
      });
  };

  const verifyLogin = () => {
    setLoading(true);
    const url = ISADMIN ? "/auth/admin/login" : "/auth/login";
    const data = ISADMIN
      ? { accountId: userId, verifyCode }
      : { userId: userId, verifyCode };
    axios
      .post(BASE_URL + url, data)
      .then((res) => {
        if (res.data.account) {
          setLoading(false);
          setState({ jwt: res.data.token, account: res.data.account });
          localStorage.setItem("id_token_acc", res.data.token);
          localStorage.removeItem("id_token");
          navigate("/admin");
        } else {
          setLoading(false);
          setState({ jwt: res.data.token, user: res.data.user });
          localStorage.setItem("id_token", res.data.token);
          localStorage.removeItem("id_token_acc");
          navigate("/wallet");
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("wrong code!");
      });
  };
  return (
    <Grid container>
      <Grid item md={3} xs={1} />
      <Grid item md={6} xs={10} style={{ justifyContent: "center", alignContent: "center" }}>
        <img src={headerImage} style={{height: 140, marginTop: 30}} />
        <h3 style={{ fontSize: 25, marginTop: 30 }}>Sign into</h3>
        <h1 style={{ fontSize: 45, marginTop: -20 }}>Blocksend {ISADMIN && "Admin"}</h1>
        <Grid container>
          <Grid item md={3} xs={1}></Grid>
          <Grid item xs={10} md={6}>
            {loading && <h3>Loading...</h3>}
            {codeSent ? (
              <React.Fragment>
                <div className="formBlock">
                  <TextField
                    type="text"
                    value={verifyCode}
                    placeholder="123456"
                    id="verifyCode"
                    fullWidth
                    onChange={(e) => setVerifyCode(e.target.value)}
                    label="Verify Code"
                    variant="outlined"
                  />
                </div>
                <p><i>Be sure to check your spam</i></p>
                <div className="formBlock">
                  <Button
                    variant="contained"
                    style={{ width: 200 }}
                    size="large"
                    disabled={!verifyCode || loading}
                    onClick={verifyLogin}
                  >
                    Verify
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="formBlock">
                  <TextField
                    type="text"
                    value={email}
                    // style={{ paddingLeft: 80, paddingRight: 80 }}
                    placeholder="joe@smith.com"
                    fullWidth
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    label={ISADMIN ? "Enter your email" : "Enter your email or phone number"}
                    variant="outlined"
                  />
                </div>
                <div className="formBlock">
                  <Button
                    variant="contained"
                    disabled={!email || loading}
                    size="large"
                    style={{ width: 200 }}
                    onClick={sendCode}
                  >
                    Continue
                  </Button>
                </div>
              </React.Fragment>
            )}
            <div style={{ marginTop: 60, color: "black", cursor: "pointer" }} onClick={() => ISADMIN ? navigate("/login") : navigate("/adminLogin")}>
              <p>{ISADMIN ? "Login as user" : "Login to admin"}</p>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
