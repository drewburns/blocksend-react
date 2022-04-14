import React from "react";
import { Card, Grid, Button, TextField } from "@mui/material";
import axios from "axios";
import { GlobalContext } from "../utility/GlobalContext";
import { useNavigate } from "react-router-dom";
export default function Login(props) {
  // const BASE_URL = "http://localhost:8080";
  const BASE_URL = "https://blocksend-dev.herokuapp.com";
  const [email, setEmail] = React.useState("");
  const [verifyCode, setVerifyCode] = React.useState("");
  const [codeSent, setCodeSent] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const { state, setState } = React.useContext(GlobalContext);
  let navigate = useNavigate();
  const ISADMIN = props.admin;

  const sendCode = () => {
    setCodeSent(true);
    const url = ISADMIN ? "/auth/admin/code" : "/auth/code";
    axios
      .post(BASE_URL + url, { email })
      .then((res) => {
        setCodeSent(true);
        setUserId(res.data.userId || res.data.accountId);
      })
      .catch((err) => {
        alert("wrong email!");
        setEmail("");
      });
  };

  const verifyLogin = () => {
    const url = ISADMIN ? "/auth/admin/login" : "/auth/login";
    const data = ISADMIN
      ? { accountId: userId, verifyCode }
      : { userId: userId, verifyCode };
    axios
      .post(BASE_URL + url, data)
      .then((res) => {
        if (res.data.account) {
          setState({ jwt: res.data.token, account: res.data.account });
          localStorage.setItem("id_token_acc", res.data.token);
          localStorage.removeItem("id_token");
          navigate("/admin");
        } else {
          setState({ jwt: res.data.token, user: res.data.user });
          localStorage.setItem("id_token", res.data.token);
          localStorage.removeItem("id_token_acc");
          navigate("/wallet");
        }
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
              <h3>{ISADMIN ? "Admin Login" : "User Login"}</h3>
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
                      label={ISADMIN ? "Email" : "Email or Phone Number"}
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
