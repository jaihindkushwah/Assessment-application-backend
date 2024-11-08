// npm install eureka-js-client
const Eureka = require("eureka-js-client").Eureka;

// Eureka client configuration
const client = new Eureka({
  instance: {
    app: "express-api",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: {
      $: 3000, // Your Express.js server port
      "@enabled": true,
    },
    vipAddress: "express-api",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn", // Use 'MyOwn' for local instances
    },
  },
  eureka: {
    host: "localhost", // Eureka server host
    port: 8761, // Eureka server port
    servicePath: "/eureka/apps/",
  },
});

// Start Eureka client
client.start((error: any) => {
  console.log("Eureka registration complete:", error || "Success");
});

module.exports = client;

const express = require("express");
const eurekaClient = require("./eureka-client");

const app = express();
const port = 3000;

// Your Express routes here
app.get("/", (req: any, res: any) => {
  res.send("Hello from Express API");
});

// Start the server
app.listen(port, () => {
  console.log(`Express API listening at http://localhost:${port}`);

  // Start the Eureka client
  eurekaClient.start();
});
