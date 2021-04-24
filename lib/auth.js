const SpotifyWebApi = require('spotify-web-api-node');
const ora = require('ora');
const open = require('open');

module.exports = async () => {
    const scopes = ['playlist-modify-public'];
    const clientId = process.env.CLIENT_ID;
    const state = 'some-state-of-my-choice';

    const spotifyApi = new SpotifyWebApi({
        clientId,
        redirectUri: 'https://example.com/callback',
    });
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    // TODO test headless chromium or use another method for auth
    await open(authorizeURL);

    ora().succeed(`SAVE VALUE OF QUERY CODE TO tokens.json`);
};
