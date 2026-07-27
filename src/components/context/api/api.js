import React from 'react'
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sophiehiggs.alwaysdata.net/api/',
  headers: {
    "Content-Type": "application/json",
  }
})

api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    console.log(access_token)
    if (access_token && config.url !== "core/login/") {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  }
);


export default api
