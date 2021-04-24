const fs = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
const async = require('async');
const ora = require('ora');

const createFile = require('./utils/create-file');
const removeDuplicationTracks = require('./utils/remove-duplication-tracks');
const tokens = require('../tokens.json');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const progress = ora();

module.exports = async ({ filename, playlistName = 'spotifyTransfer', isDebug } = {}) => {
    const music = JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }));
    const allTracks = removeDuplicationTracks(music);

    if (allTracks.length === 0) {
        ora().fail('0 tracks');
        process.exitCode = 1;
    }

    const spotifyApi = new SpotifyWebApi({
        ...(tokens.code
            ? {}
            : {
                  accessToken: tokens.accessToken,
                  refreshToken: tokens.refreshToken,
              }),
        clientSecret,
        clientId,
        redirectUri: 'https://example.com/callback',
    });

    if (tokens.code) {
        try {
            const {
                body: { expires_in, access_token, refresh_token },
            } = await spotifyApi.authorizationCodeGrant(tokens.code);

            if (isDebug) {
                progress.info('The token expires in ' + expires_in);
                progress.info('The access token is ' + access_token);
                progress.info('The refresh token is ' + refresh_token);
            }

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            createFile(
                '../tokens.json',
                JSON.stringify({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                })
            );
        } catch (error) {
            console.log(error);
            return progress.fail('Could not auth with code');
        }
    } else {
        try {
            const {
                body: { access_token },
            } = await spotifyApi.refreshAccessToken();

            progress.info('The access token has been refreshed!');

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(access_token);
            createFile(
                '../tokens.json',
                JSON.stringify({
                    accessToken: access_token,
                    refreshToken: tokens.refreshToken,
                })
            );
        } catch (error) {
            console.log(error);
            return progress.fail('Could not refresh access token');
        }
    }

    const queueSearchTrack = async.queue((task, callback) => {
        spotifyApi
            .searchTracks(`track:${task.name} artist:${task.artist}`)
            .then((result) => {
                if (result.body.tracks.items.length > 0) {
                    callback(undefined, result.body.tracks.items[0].uri);
                    return;
                }

                callback();
            })
            .catch((error) => {
                if (isDebug) {
                    console.log(error);
                }
                callback('error');
            });
    });

    progress.info(`Started! tracks to import in spotify ${allTracks.length}`);
    let playlistId;
    let importedTracksCount = 0;
    let ERRORS_TRACKS = [];

    const importTracks = async (tracks = [], copyTracks = [...tracks]) => {
        const ALL_TRACKS = [];

        copyTracks.splice(0, 100).forEach((item) => {
            queueSearchTrack.push(item, (error, data) => {
                if (error) {
                    if (isDebug) {
                        progress.fail(`Error: ${item.artist} - ${item.name}`);
                    }

                    ERRORS_TRACKS.push(item);
                }

                if (data) {
                    ALL_TRACKS.push(data);
                    importedTracksCount += 1;
                    progress.start(
                        `Import tracks to spotify \nProgress: ${importedTracksCount}/${allTracks.length}\nCurrent track: ${item.artist} - ${item.name}`
                    );
                }
            });
        });
        await queueSearchTrack.drain();

        if (ALL_TRACKS.length > 0) {
            if (!playlistId) {
                const result = await spotifyApi.createPlaylist(playlistName, { public: true });
                playlistId = result.body.id;

                progress.info('Playlist created!');
            }

            try {
                await spotifyApi.addTracksToPlaylist(playlistId, ALL_TRACKS);
                if (isDebug) {
                    progress.info(`Added ${ALL_TRACKS.length} tracks to playlist!`);
                }
            } catch {
                // Save tracks and try add it later
                ERRORS_TRACKS = [...ERRORS_TRACKS, ALL_TRACKS];
            }
        }

        if (copyTracks.length > 0) {
            importTracks(undefined, copyTracks);
        } else {
            if (ERRORS_TRACKS.length > 0) {
                importTracks(undefined, ERRORS_TRACKS);
            } else {
                progress.succeed('Completed!');
                progress.succeed(`Imported tracks ${importedTracksCount}/${allTracks.length}`);
                process.exitCode = 1;
            }
        }
    };

    importTracks(allTracks);
};
