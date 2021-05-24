const SpotifyWebApi = require('spotify-web-api-node');
const open = require('open');

const config = require('./config');

const login = async () => {
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

    config.progress.succeed(`SAVE VALUE OF QUERY CODE TO tokens.json`);
};

module.exports = login;
