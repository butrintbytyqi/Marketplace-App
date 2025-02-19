import { useContext } from "react";
import AuthContext from "./context";
import authStorage from "./storage";
import { jwtDecode } from "jwt-decode";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = async (authToken) => {
    try {
      if (!authToken) {
        console.log("No auth token provided to logIn");
        return;
      }

      // Validate and decode token
      const decoded = jwtDecode(authToken);
      if (!decoded || !decoded.userId) {
        console.log("Invalid token format - missing userId");
        return;
      }

      // Store token first
      const stored = await authStorage.storeToken(authToken);
      if (!stored) {
        console.log("Failed to store token");
        return;
      }

      // Set user in context
      setUser(decoded);
      console.log("User logged in successfully:", {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email
      });
    } catch (error) {
      console.log("Error in login:", error);
      await authStorage.removeToken();
      setUser(null);
    }
  };

  const logOut = async () => {
    try {
      setUser(null);
      await authStorage.removeToken();
      console.log("Logged out successfully");
    } catch (error) {
      console.log("Error in logout:", error);
    }
  };

  return { user, logIn, logOut };
};
