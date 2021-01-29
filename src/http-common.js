import axios from "axios";

export default axios.create({
  //baseURL: "https://www.zdslogic.com/dashboard-server/api/",

  baseURL: "http://localhost:8081/resource-server/api",
  
  headers: {
    "Content-type": "application/json"
  }
});