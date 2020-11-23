const errors = require('./modules/errors');
const scrape = require('./modules/scrape');
const parse = require('./modules/parse');

const path = require('path');
const fs = require('fs');

const pathToCache = path.join(__dirname, 'cache');

let confirmed = undefined;
let recovered = undefined;
let deaths = undefined;

const getPathForDataset = type => 
  path.join(pathToCache, `${type}.json`);

const refresh = async () => {
  const response = await scrape().then(() => parse())
    .then(() => ({ error: null })).catch(error => ({ error }));
  if (response.error) throw response.error;

  confirmed = require(getPathForDataset('confirmed'));
  recovered = require(getPathForDataset('recovered'));
  deaths = require(getPathForDataset('deaths'));
}

const init = async () => {
  const exists = await fs.promises.access(pathToCache)
    .then(() => true).catch(() => false);
  if (!exists)
    await fs.promises.mkdir(pathToCache);
  const response = await refresh()
    .then(() => ({ error: null })).catch(error => ({ error }));
  if (response.error) 
    throw errors.datasetInitializationFailed();
}

init();
