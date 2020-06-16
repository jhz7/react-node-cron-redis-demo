const { promisify } = require("util");
const redisClient = require('redis').createClient();

const getAsync = promisify(redisClient.get).bind(redisClient);

const express = require('express');

const app = express();
const port = 3001;

app.get('/jobs', async (req, res) => {

  const jobs = await getAsync('github');
  return res
    .header('Access-Control-Allow-Origin', "http://localhost:3000")
    .json(JSON.parse(jobs));
});

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})