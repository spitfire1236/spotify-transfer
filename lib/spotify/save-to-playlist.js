const config = require('../config');

const saveToPlaylist = async ({ tracks = [], playlistId }) => {
    try {
        const allIds = tracks.map(({ spotifyId }) => spotifyId);
        await config.api.addTracksToPlaylist(playlistId, allIds);

        if (config.isDebug) {
            config.progress.info(`Added ${allIds.length} tracks to playlist! ${JSON.stringify(allIds)}`);
        }
    } catch (error) {
        console.log('ERROR ADD TRACKS TO PLAYLIST', error);
    }
};

module.exports = saveToPlaylist;
