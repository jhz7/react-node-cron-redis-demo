const fetch = require('node-fetch');

const { promisify } = require("util");
const redisClient = require('redis').createClient();

const setAsync = promisify(redisClient.set).bind(redisClient);

const baseUrl = 'https://jobs.github.com/positions.json';

async function fetchGithub() {

  let resultCount = 1, onPage = 0;
  const allJobs = [];

  while(resultCount > 0) {

    const resp = await fetch(`${baseUrl}?page=${onPage}`);
    const jobs = await resp.json();
    resultCount = jobs.length;

    allJobs.push(...jobs);
    onPage++;
  }

  const jrJobs = allJobs.filter(job => {

    const title = job.title.toLowerCase();

    if(
      title.includes('senior') ||
      title.includes('manager') ||
      title.includes('sr.') ||
      title.includes('architect')
    ) {
      return false;
    }

    return true;
  })

  console.log(`Jr jobs gotten ${jrJobs.length} at ${new Date()}`);

  const success = await setAsync('github', JSON.stringify(jrJobs));

  console.log({success});
}

module.exports = fetchGithub;
