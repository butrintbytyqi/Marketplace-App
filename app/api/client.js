import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.0.31:9000/api",
  timeout: 15000, // 15 second timeout
  headers: {
    "Accept": "application/json",
  }
});

// Create a custom instance for listings that doesn't auto-add the token
const listingsClient = create({
  baseURL: "http://192.168.0.31:9000/api",
  timeout: 15000,
  headers: {
    "Accept": "application/json",
  }
});

apiClient.addAsyncRequestTransform(async (request) => {
  try {
    const authToken = await authStorage.getToken();
    if (!authToken) {
      console.log("No auth token found");
      return;
    }

    request.headers["x-auth-token"] = authToken;
    
    // Log headers without the actual token
    const headers = { ...request.headers };
    if (headers["x-auth-token"]) {
      headers["x-auth-token"] = "[hidden]";
    }
    console.log("Request headers:", headers);
  } catch (error) {
    console.log("Error setting auth token:", error);
  }
});

// Monitor responses
const addResponseMonitor = (client) => {
  client.addMonitor((response) => {
    const { url, method, data: requestData } = response.config;
    
    if (!response.ok) {
      console.log("API Response Error:", {
        url,
        method,
        problem: response.problem,
        status: response.status,
        data: response.data,
        requestData: requestData ? JSON.stringify(requestData) : undefined,
      });
    }
  });
};

addResponseMonitor(apiClient);
addResponseMonitor(listingsClient);

// Configure client to handle FormData for POST and PUT requests
const configureFormDataRequests = (client) => {
  const originalPost = client.post;
  const originalPut = client.put;

  client.post = (url, data, axiosConfig = {}) => {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    };
    return originalPost(url, data, config);
  };

  client.put = (url, data, axiosConfig = {}) => {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    };
    return originalPut(url, data, config);
  };
};

configureFormDataRequests(apiClient);
configureFormDataRequests(listingsClient);

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export { listingsClient };
export default apiClient;
