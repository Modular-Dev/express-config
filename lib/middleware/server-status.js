const moment = require('moment');
const startTime = new Date().getTime();

module.exports = function(app) {
  return function(req, res, next) {
    let status, uptime;
    uptime = new Date(new Date().getTime() - startTime).toUTCString().split(" ")[4];
    status = {
      status: 'up',
      startedOn: moment(startTime),
      uptime: moment(startTime).fromNow(),
      lastDeployed: uptime
    };
    return res.send(status);
  };
};
