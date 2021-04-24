# Spotify transfer

## How to run

```bash
node bin/spotify-transfer.js
```

## How to get all tracks from vk

1. scroll music page to the end
1. copy and paste this script to the devtools console
1. create json file and paste data from clipboard

```javascript
cleanText = (string) =>
    string
        .replace(/(\(|\[|feat|ft).+(\]|\))/g, '')
        .replace(/\"/g, '')
        .trim();
music = [].slice
    .call($$('.audio_row__performer_title'))
    .map((title) => {
        const artist = title.querySelector('.audio_row__performers a');
        const songName = title.querySelector('.audio_row__title_inner');

        if (artist && songName) {
            return {
                artist: cleanText(artist.textContent),
                name: cleanText(songName.textContent),
            };
        }

        return;
    })
    .filter(Boolean);

copy(music);
```
