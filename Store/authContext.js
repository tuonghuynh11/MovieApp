import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  uid: "",
  isAuthenticated: false,
  authenticate: (token, uid) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [uid, setUid] = useState();
  function authenticate(token, uid) {
    setAuthToken(token);
    setUid(uid);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("uid", uid);
  }
  function logout() {
    setAuthToken(null);
    setUid(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("uid");
  }

  const value = {
    token: authToken,
    uid: uid,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
