const config = require('./config');
const searchTracks = require('./spotify/search-tracks');
const createPlaylist = require('./spotify/create-playlist');
const saveToPlaylist = require('./spotify/save-to-playlist');

let importedTracksCount = 0;
let allTracksCount = 0;

const executeImport = async ({ tracks = [], playlist = {}, max = Infinity }) => {
    const unprocessedTracks = tracks.slice(max);
    const slicedTracks = tracks.slice(0, max);
    const { errors, found } = await searchTracks(slicedTracks, {
        onSuccess({ name, artist }) {
            config.progress.start(`Import tracks to spotify\nCurrent track: ${artist} - ${name}`);
        },
        onError({ name, artist }) {
            config.progress.fail(`Error: ${artist} - ${name}`);
        },
    });

    if (found.length > 0) {
        if (!playlist.id) {
            allTracksCount = tracks.length;
            playlist.id = await createPlaylist(playlist.name);
            config.progress.info(`Playlist ${playlist.name} created!`);
        }

        await saveToPlaylist({
            tracks: found,
            playlistId: playlist.id,
        });

        importedTracksCount += found.length;
    }

    return { playlist, tracks: [].concat(errors, unprocessedTracks) };
};

const importTracks = async ({ tracks, playlist }) => {
    if (tracks.length > 0) {
        const newState = await executeImport({ tracks, playlist, max: 100 });

        importTracks(newState);
    } else {
        config.progress.succeed('Completed!');
        config.progress.succeed(`Imported tracks ${importedTracksCount}/${allTracksCount}`);
        // mb return?
        process.exitCode = 1;
    }
};

module.exports = importTracks;
