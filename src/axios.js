import axios from "axios";

const instance = axios.create({
   baseURL: "https://polling-unit-server.onrender.com/"
});

export default instance;
