const path = require('path');

const createFile = require('./utils/create-file');

function saveTokens({ accessToken, refreshToken } = {}) {
    if (accessToken) {
        createFile(
            path.join(__dirname, '../tokens.json'),
            JSON.stringify({
                accessToken,
                refreshToken,
            })
        );
    }
}

module.exports = saveTokens;
