const config = require('../config');

const authCodeGrant = async (code) => {
    const {
        body: { expires_in: expiresIn, access_token: accessToken, refresh_token: refreshToken },
    } = await config.api.authorizationCodeGrant(code);

    // Set the access token on the API object to use it in later calls
    config.api.setAccessToken(accessToken);
    config.api.setRefreshToken(refreshToken);

    return { expiresIn, accessToken, refreshToken };
};

module.exports = authCodeGrant;
