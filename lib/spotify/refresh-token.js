const config = require('../config');

const refreshToken = async () => {
    const {
        body: { access_token },
    } = await config().api.refreshAccessToken();

    // Save the access token so that it's used in future calls
    config().api.setAccessToken(access_token);

    return access_token;
};

module.exports = refreshToken;
