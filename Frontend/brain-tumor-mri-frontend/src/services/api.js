import axios from "axios";
import toast from "react-hot-toast";

// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 30000,
});

/**
 * A reusable function for making API calls.
 * @param {string} method - The HTTP method (e.g., 'get', 'post').
 * @param {string} url - The API endpoint.
 * @param {object} [data=null] - The data to send with the request.
 * @param {object} [config={}] - Optional axios config.
 * @returns {Promise<any>} - The response data from the API.
 */
export const apiCall = async (method, url, data = null, config = {}) => {
  let toastId;

  try {
    if (method.toLowerCase() !== "get") {
      toastId = toast.loading("Loading...");
    }

    const response = await apiClient({
      method,
      url,
      data,
      ...config, 
    });

    if (toastId) {
      toast.dismiss(toastId);
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "An unexpected error occurred.";

    if (toastId) {
      toast.error(errorMessage, { id: toastId });
    } else {
      toast.error(errorMessage);
    }

    throw error;
  }
};

export default apiClient;
