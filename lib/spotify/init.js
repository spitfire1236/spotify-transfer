const SpotifyWebApi = require('spotify-web-api-node');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const init = ({ code, accessToken, refreshToken }) =>
    new SpotifyWebApi({
        ...(code
            ? {}
            : {
                  accessToken,
                  refreshToken,
              }),
        clientSecret,
        clientId,
        redirectUri: 'https://example.com/callback',
    });

module.exports = init;
