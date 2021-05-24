const queueSearchTrack = require('./queue-search-track');

const searchTracks = async (tracks = [], { onError, onSuccess }) => {
    const found = [];
    const errors = [];

    queueSearchTrack.error((_err, item) => {
        errors.push(item);
        onError && onError(item);
    });

    tracks.forEach(async ({ artist, name, spotifyId }) => {
        if (!spotifyId) {
            const tracks = await queueSearchTrack.push({ artist, name });

            if (tracks) {
                const [{ uri: id } = {}] = tracks;

                if (id) {
                    found.push({ name, artist, spotifyId: id });
                    onSuccess && onSuccess({ name, artist, id });
                }
            }
        }
    });

    await queueSearchTrack.drain();

    return { errors, found };
};

module.exports = searchTracks;
