import client from "./client";

const login = async (credentials) => {
  console.log("Making login request with:", credentials);
  const response = await client.post("/auth", credentials);
  console.log("Login response:", response);
  return response;
};

export default { login };
