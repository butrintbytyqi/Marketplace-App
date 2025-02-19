import client from "./client";

const register = async (userInfo) => {
  console.log("Making registration request with:", {
    ...userInfo,
    password: "****" // mask password in logs
  });
  const response = await client.post("/users", userInfo);
  console.log("Registration response:", {
    ok: response.ok,
    status: response.status,
    data: response.data,
    problem: response.problem
  });
  return response;
};

export default {
  register,
};
