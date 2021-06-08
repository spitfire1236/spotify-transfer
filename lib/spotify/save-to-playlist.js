const config = require('../config');

const saveToPlaylist = async ({ tracksIds = [], playlistId }) => {
    try {
        await config().api.addTracksToPlaylist(playlistId, tracksIds);

        if (config().isDebug) {
            config().progress.info(
                `Added ${tracksIds.length} tracks to playlist! ${JSON.stringify(tracksIds)}`
            );
        }
    } catch (error) {
        console.log('ERROR ADD TRACKS TO PLAYLIST', error);
    }
};

module.exports = saveToPlaylist;
