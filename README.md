# mpv-cheatsheet

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
