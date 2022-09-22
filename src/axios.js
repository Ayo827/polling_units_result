import axios from "axios";

const instance = axios.create({
   baseURL: "https://polling-unit-server.herokuapp.com/"
});

export default instance;
