import axios from "axios";

// Create an axios instance for API requests
const http = axios.create({
  baseURL: "http://localhost:9000", // Update with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
