const config = require('../config');
const withQueue = require('../utils/with-queue');

const searchTracksWithQueue = async (tracks = [], { onError, onSuccess }) => {
    const found = [];
    const errors = [];

    await withQueue(
        ({ name, artist }) => config().api.searchTracks(`track:${name} artist:${artist}`),
        tracks,
        {
            onSuccess({
                body: {
                    tracks: { items },
                },
            }) {
                if (items.length > 0) {
                    const [{ uri, name, artists: [firstArtist] } = {}] = items;
                    const data = {
                        name,
                        id: uri,
                        artist: firstArtist.name,
                    };

                    found.push(data);
                    onSuccess && onSuccess(data);
                }
            },
            onError(_error, data) {
                errors.push(data);
                onError && onError(data);
            },
        }
    );

    return { errors, found };
};

module.exports = searchTracksWithQueue;
