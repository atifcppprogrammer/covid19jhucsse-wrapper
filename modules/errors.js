exports.networkRequestFailed = () => {
  const message = 'Network Request intending to collect dataset '
          .concat('from JHU-CSSE\'s GitHub Repository failed !');
  return new Error(message);
}

exports.datasetInitializationFailed = () => {
  const message = 'JHU-CSSE Dataset initialization failed owing '
          .concat('to network error !');
  return new Error(message);
}

exports.incorrectDatasetType = () => {
  const message = 'Specified Dataset type must be one of '
	  .concat('[ confirmed, recovered, deaths ]');
  return new Error(message);
}
