const authCodeGrant = require('./auth-code-grant');
const refreshToken = require('./refresh-token');

const auth = async (code) => {
    let tokens = {};

    if (code) {
        tokens = await authCodeGrant(code);
    } else {
        const accessToken = await refreshToken();
        tokens = { accessToken };
    }

    return tokens;
};

module.exports = auth;
