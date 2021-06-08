const fs = require('fs');

const auth = require('./spotify/auth');

const removeDuplicationTracks = require('./utils/remove-duplication-tracks');

const { setConfig, config } = require('./config');
const importTracks = require('./import-tracks');
const saveTokens = require('./save-tokens');
const tokens = require('../tokens.json');

module.exports = async ({ filename, playlistName = 'spotifyTransfer', isDebug } = {}) => {
    setConfig({ isDebug });

    try {
        const { accessToken, refreshToken } = await auth(tokens.code);

        saveTokens({ accessToken, refreshToken: refreshToken || tokens.refreshToken });
    } catch (error) {
        if (isDebug) {
            console.log(error);
        }

        config().progress.fail('cannot auth :(');
        return;
    }

    const music = JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }));

    if (music.length === 0) {
        config().progress.fail('0 tracks');
        return;
    }

    const uniqTracks = removeDuplicationTracks(music);
    config().progress.info(`Started! tracks to import in spotify ${uniqTracks.length}`);

    // TODO search exist playlist
    await importTracks({ tracks: uniqTracks, playlist: { name: playlistName } });
};
