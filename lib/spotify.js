const fs = require('fs');
const path = require('path');

const init = require('./spotify/init');
const auth = require('./spotify/auth');

const createFile = require('./utils/create-file');
const removeDuplicationTracks = require('./utils/remove-duplication-tracks');

const config = require('./config');
const importTracks = require('./import-tracks');
const tokens = require('../tokens.json');

module.exports = async ({ filename, playlistName = 'spotifyTransfer', isDebug } = {}) => {
    const music = JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }));

    if (music.length === 0) {
        config.progress.fail('0 tracks');
        return;
    }

    config.isDebug = isDebug;
    config.api = init(tokens);

    try {
        const { accessToken, refreshToken } = await auth(tokens.code);

        if (accessToken) {
            createFile(
                path.join(__dirname, '../tokens.json'),
                JSON.stringify({
                    accessToken,
                    refreshToken: refreshToken || tokens.refreshToken,
                })
            );
        }
    } catch (error) {
        if (isDebug) {
            console.log(error);
        }

        config.progress.fail('cannot auth :(');
        return;
    }

    const uniqTracks = removeDuplicationTracks(music);
    config.progress.info(`Started! tracks to import in spotify ${uniqTracks.length}`);

    // TODO search exist playlist
    await importTracks({ tracks: uniqTracks, playlist: { name: playlistName } });
};
