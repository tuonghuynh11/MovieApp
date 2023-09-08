import { useContext, useState } from "react";
import AuthContent from "../Athentication/Auth/AuthContent";
import Loading from "../Component/UI/Loading";
import { AuthContext } from "../Store/authContext";
import { createUser } from "../util/auth";
import { addNewUser } from "../util/firebase";
function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  async function signUpHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const data = await createUser(email, password);
      authCtx.authenticate(data.idToken, data.localId);
      addNewUser(data.localId, email);
    } catch (err) {
      const errorMessage = err.response.data.error.message;
      Alert.alert(
        "Authentication failed!",
        errorMessage
          ? errorMessage
          : "Could not create user. Please check your input and try again later!"
      );
      setIsAuthenticating(false);
    }
  }
  if (isAuthenticating) {
    return <Loading message="Creating user..." />;
  }
  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
