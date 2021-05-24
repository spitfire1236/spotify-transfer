const queue = require('async/queue');

const config = require('../config');

const queueSearchTrack = queue(async ({ name, artist }) => {
    const { body } = await config.api.searchTracks(`track:${name} artist:${artist}`);

    return body.tracks.items;
});

module.exports = queueSearchTrack;
