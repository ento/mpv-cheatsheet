# mpv-cheatsheet

## Installation

Download the latest release from [releases page](https://github.com/ento/mpv-cheatsheet/releases/latest).

It can be passed directly using the `--script` option when launching mpv.
```sh
mpv video.mp4 --script=mpv-cheatsheet.js
```

or you can save the file in a `scripts` subdirectory (create one if it doesn't exist) in the mpv configuration directory ( usually `~/.config/mpv/scripts/`  or `C:\Users\<USERNAME>\AppData\Roaming\mpv\scripts` ) and mpv will launch the script everytime. [Learn more](https://mpv.io/manual/stable/#script-location).

## Usage

Press `?` to bring up the cheatsheet.

![Screenshot](./mpv-shot0001.jpg)

## Development

### Building locally

```
direnv allow
make
make install # copies built script to ~/.config/mpv/scripts/
```

### Versioning

Version numbers follow the format `v${mpv-version}.${script-version}`
where `script-version` is a single number that resets to 0 when `mpv-version`
is bumped.
