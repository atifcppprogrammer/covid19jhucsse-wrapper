exports.networkRequestFailed = () => {
  const message = 'Network Request intending to collect dataset '
          .concat('from JHU-CSSE\'s GitHub Repository failed !');
  return new Error(message);
}
