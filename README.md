
## pelias

Meta package for `pelias` open-source geocoder/reverse geocoder.

### Installing elasticsearch/nodejs etc.

[Install Instructions](https://github.com/mapzen/pelias/blob/node/INSTALL.md)

### Creating the required mappings in elasticsearch:

```bash
node scripts/01_create_index.js;
```

### Different parts of the system are split up in to individual modules and repositories:

- [pelias-geonames](https://github.com/mapzen/pelias-geonames)
- [pelias-quattroshapes](https://github.com/mapzen/pelias-quattroshapes)
- [pelias-webview](https://github.com/mapzen/pelias-webview)
- [pelias-esclient](https://github.com/mapzen/pelias-esclient)