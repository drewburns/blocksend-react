import React, { useEffect, useState } from "react";

import jwtDecode from "jwt-decode";

const GlobalContext = React
  .createContext
  //   (null as unknown) as ContextProps
  ();

const initialState = {
  jwt: "",
  loading: true,
  user: {},
  currentUserID: null,
  account: {},
};

const GlobalContextProvider = (props) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      // localStorage.removeItem("id_token");
      const value = localStorage.getItem("id_token");
      console.log("LCOAL STORAGE, ", value);
      if (value !== null) {
        const decodedToken = jwtDecode(value, { header: false });
        const currentUserID = decodedToken.id;
        setState({
          jwt: value,
          user: decodedToken,
          loading: false,
          currentUserID: currentUserID,
        });
        return;
      }

      const valueAcc = localStorage.getItem("id_token_acc");
      console.log("account storage", valueAcc);
      if (valueAcc !== null) {
        const decodedToken = jwtDecode(valueAcc, { header: false });
        const currentAccountID = decodedToken.id;
        setState({
          jwt: valueAcc,
          account: decodedToken,
          loading: false,
          currentAccountID: currentAccountID,
        });
      }
    })();
  }, []);

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
