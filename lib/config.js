const ora = require('ora');

const init = require('./spotify/init');
const tokens = require('../tokens.json');

let configData = {
    progress: ora(),
    api: init(tokens),
    isDebug: false,
};

module.exports = {
    config: () => configData,
    setConfig: (config) => {
        configData = Object.assign(configData, config);
    },
};
