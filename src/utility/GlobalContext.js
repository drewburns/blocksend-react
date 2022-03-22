import React, { useEffect, useState } from "react";

import jwtDecode from "jwt-decode";

const GlobalContext = React
  .createContext
  //   (null as unknown) as ContextProps
  ();

const initialState = { jwt: "", loading: true, user: {}, currentUserID: null };

const GlobalContextProvider = (props) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      // localStorage.removeItem("id_token");
      const value = localStorage.getItem("id_token");
      if (value !== null) {
        const decodedToken = jwtDecode(value, { header: false });
        const currentUserID = decodedToken.id;
        setState({
          jwt: value,
          user: decodedToken,
          loading: false,
          currentUserID: currentUserID,
        });
      } else {
        setState({
          loading: false,
        });
      }
      // If you want to also store it in async storage,
      // you could always access it here and set the jwt in state
    })();
  }, []);

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
