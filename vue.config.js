// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:9000", // Replace with your backend server URL
        changeOrigin: true, // For virtual hosted sites
        secure: false, // Set to true if your API server uses HTTPS
      },
    },
  },
};
