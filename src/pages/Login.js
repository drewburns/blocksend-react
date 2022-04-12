import React from "react";
import { Card, Grid, Button, TextField } from "@mui/material";
import axios from "axios";
import { GlobalContext } from "../utility/GlobalContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  // const BASE_URL = "http://localhost:8080";
  // const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const BASE_URL = "https://api.blocksend.co";
  const [email, setEmail] = React.useState("");
  const [verifyCode, setVerifyCode] = React.useState("");
  const [codeSent, setCodeSent] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const { state, setState } = React.useContext(GlobalContext);
  let navigate = useNavigate();

  const sendCode = () => {
    setCodeSent(true);
    axios
      .post(BASE_URL + "/auth/code", { email })
      .then((res) => {
        setCodeSent(true);
        setUserId(res.data.userId);
      })
      .catch((err) => {
        alert("wrong email!");
      });
  };

  const verifyLogin = () => {
    axios
      .post(BASE_URL + "/auth/login", { userId: userId, verifyCode })
      .then((res) => {
        setState({ jwt: res.data.token, user: res.data.user });
        localStorage.setItem("id_token", res.data.token);
        navigate("/wallet");
      })
      .catch((err) => {
        alert("wrong code!");
      });
  };
  return (
    <Grid container>
      <Grid item md={3} xs={1} />
      <Grid item md={6} xs={10}>
        <Card className="sendBlock">
          <Grid container>
            <Grid item md={3} xs={1}></Grid>
            <Grid item xs={10} md={6}>
              <h3>Login</h3>
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
                  <div className="formBlock">
                    <Button
                      variant="contained"
                      disabled={!verifyCode}
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
                      label="Email or Phone Number"
                      variant="outlined"
                    />
                  </div>
                  <div className="formBlock">
                    <Button
                      variant="contained"
                      disabled={!email}
                      onClick={sendCode}
                    >
                      Login
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
