import AuthContent from "../Athentication/Auth/AuthContent";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import Loading from "../Component/UI/Loading";
import { AuthContext } from "../Store/authContext";
import { login } from "../util/auth";
import { View } from "react-native";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const data = await login(email, password);
      authCtx.authenticate(data.idToken, data.localId);
    } catch (err) {
      const errorMessage = err.response.data.error.message;
      Alert.alert(
        "Authentication failed!",
        errorMessage
          ? errorMessage
          : "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }
  if (isAuthenticating) {
    return <Loading message="Logging you in..." />;
  }
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
