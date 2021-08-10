const { config } = require('./config');
const withQueue = require('./utils/with-queue');

let importedTracksCount = 0;
let allTracksCount = 0;

const importTracks = async ({ tracks, playlist = {}, max = 100 }) => {
    const localPlaylist = { ...playlist };
    allTracksCount = tracks.length;
    const queue = tracks.slice();

    while (queue.length) {
        const slicedTracks = queue.splice(0, max);
        const foundTrackIds = [];

        await withQueue(
            ({ name, artist }) => config().api.searchTracks(`track:${name} artist:${artist}`),
            slicedTracks,
            {
                onSuccess({
                    body: {
                        tracks: { items },
                    },
                }) {
                    if (items.length > 0) {
                        const [{ uri, name, artists: [firstArtist] } = {}] = items;

                        foundTrackIds.push(uri);
                        config().progress.start(
                            `Import tracks to spotify\nCurrent track: ${firstArtist.name} - ${name}`
                        );
                    }
                },
                onError(_error, data) {
                    if (config().isDebug) {
                        console.log(_error);
                    }

                    queue.push(data);
                    config().progress.fail(`Error: ${data.artist} - ${data.name}`);
                },
            }
        );

        if (foundTrackIds.length > 0) {
            if (!localPlaylist.id) {
                const {
                    body: { id },
                } = await config().api.createPlaylist(localPlaylist.name, { public: true });
                localPlaylist.id = id;
                config().progress.info(`Playlist ${localPlaylist.name} created!`);
            }

            try {
                await config().api.addTracksToPlaylist(localPlaylist.id, foundTrackIds);

                if (config().isDebug) {
                    config().progress.info(`Added ${foundTrackIds.length} tracks to a playlist!`);
                }
            } catch (error) {
                console.log('ERROR ADD TRACKS TO PLAYLIST', error);
            }
        }
        importedTracksCount += foundTrackIds.length;
    }

    config().progress.succeed('Completed!');
    config().progress.succeed(`Imported tracks ${importedTracksCount}/${allTracksCount}`);
};

module.exports = importTracks;
