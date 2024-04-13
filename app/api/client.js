import { create } from 'apisauce';

const apiClient = create({
  baseURL: 'http://192.168.0.34:9000/api',
});

apiClient.addResponseTransform(response => {
  if (!response.ok) {
    console.error('API Error:', response);
    throw new Error('Network error occurred');
  }
});

export default apiClient;
