
## pelias

Meta package for `pelias` open-source geocoder/reverse geocoder.

### Installing elasticsearch/nodejs etc.

[Install Instructions](https://github.com/mapzen/pelias/blob/node/INSTALL.md)

## Mapping Scripts

### Creating the required pelias mappings in elasticsearch:

```bash
node scripts/01_create_index.js;
```

### Drop all pelias mappings in elasticsearch:

```bash
node scripts/02_drop_index.js;
```

### Reset a single type:

This is useful when you want to reset a single `type` without wiping the rest of your `index`.

**Note:** Required you to edit the script to change the variable which controls which type is to be reset.

```bash
node scripts/03_reset_type.js;
```

### Different parts of the system are split up in to individual modules and repositories:

- [pelias-geonames](https://github.com/mapzen/pelias-geonames)
- [pelias-quattroshapes](https://github.com/mapzen/pelias-quattroshapes)
- [pelias-webview](https://github.com/mapzen/pelias-webview)
- [pelias-esclient](https://github.com/mapzen/pelias-esclient)