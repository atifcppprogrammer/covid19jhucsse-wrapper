const readline = require('readline');
const path = require('path');
const fs = require('fs');

const pathToCache = path.join(__dirname, '..', 'cache');

const extractDates = lineContentArray => lineContentArray.splice(4)

const extractDatasetRow = (dataset, lineContentArray) => {
  const [ region, country ] = lineContentArray.slice(0, 2);
  const figures = lineContentArray.splice(4);
  if (region !== '') {
    if (dataset.countries[country]) 
      dataset.countries[country] = { regions: { 
	...dataset.countries[country].regions, [region]: figures } }
    else dataset.countries[country] = { regions:{ [region]: figures } };
  }
  else dataset.countries[country] = figures;
}

const parseDataset = type => new Promise(resolve => {
  const reader = readline.createInterface({
    input: fs.createReadStream(path.join(pathToCache, `${type}.csv`))
  });
  let dataset = { dates:[], countries:{} }, count = 0;
  reader.on('line', lineContent => {
    lineContentArray = lineContent.split(',');
    if (count === 0) 
      dataset.dates = extractDates(lineContentArray);
    else extractDatasetRow(dataset, lineContentArray);
    ++count;
  });
  reader.on('close', () => resolve(dataset));
});

const saveParsedDataset = async (type, json) => {
  const jsonFilePath = path.join(pathToCache, `${type}.json`);
  const csvFilePath = path.join(pathToCache, `${type}.csv`);

  await fs.promises.unlink(csvFilePath);
  return fs.promises.writeFile(jsonFilePath, JSON.stringify(json));
}

module.exports = () => {
  const promises = [ 'confirmed', 'deaths', 'recovered' ]
    .map(type => parseDataset(type)
      .then(json => saveParsedDataset(type, json)));
  return Promise.all(promises);
}
