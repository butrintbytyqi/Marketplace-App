import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    if (!authToken) {
      console.log("No token provided to store");
      return false;
    }

    // Validate token before storing
    try {
      const decoded = jwtDecode(authToken);
      if (!decoded || !decoded.userId) {
        console.log("Invalid token format - missing required fields");
        return false;
      }

      console.log("Token validation successful:", {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email
      });

    } catch (error) {
      console.log("Error validating token:", error);
      return false;
    }

    await SecureStore.setItemAsync(key, authToken);
    console.log("Token stored successfully");
    return true;
  } catch (error) {
    console.log("Error storing the auth token:", error);
    return false;
  }
};

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(key);
    if (!token) {
      console.log("No token found in storage");
      return null;
    }

    // Verify token format and expiration
    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.userId) {
        console.log("Invalid token format - missing required fields");
        await removeToken();
        return null;
      }

      console.log("Token retrieved successfully:", {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email
      });
      
      return token;
    } catch (error) {
      console.log("Error decoding token:", error);
      await removeToken();
      return null;
    }
  } catch (error) {
    console.log("Error retrieving the auth token:", error);
    return null;
  }
};

const getUser = async () => {
  try {
    const token = await getToken();
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.userId) {
      console.log("Invalid user data in token");
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.log("Error getting user from token:", error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log("Token removed successfully");
  } catch (error) {
    console.log("Error removing the auth token:", error);
  }
};

export default { getToken, getUser, removeToken, storeToken };
