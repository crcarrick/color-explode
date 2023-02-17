# color-explode

[PostCSS] plugin that takes hex/rgb/hsl color variables and explodes them into their component parts.

[postcss]: https://github.com/postcss/postcss

## Input

```css
:root {
  --color-red: #ff0000;
}
```

## Output

```css
:root {
  --color-red: #ff0000;
  --color-red-r: 255;
  --color-red-g: 0;
  --color-red-b: 0;
  --color-red-rgb: 255 0 0;
  --color-red-h: 0deg;
  --color-red-s: 100%;
  --color-red-l: 50%;
  --color-red-hsl: 0deg 100% 50%;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss color-explode
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```javascript
/* @type import('color-explode').PluginOptions */
const options: PluginOptions = {
  prefix: '--color',
  types: ['#', 'rgb'], // '#' 'hsl' 'hsla' 'rgb' 'rgba'
}

module.exports = {
  plugin: [require('color-explode')(options), require('autoprefixer')],
}
```

```css
:root {
  /* `lighten` */
  --color-red--light: hsl(
    var(--color-red-h) var(--color-red-s) calc(var(--color-red-l) + 10%)
  );

  /* `darken` */
  --color-red--dark: hsl(
    var(--color-red-h) var(--color-red-s) calc(var(--color-red-l) - 10%)
  );

  /* `opacity` */
  --color-red--opaque: rgb(var(--color-red-rgb) / 0.1);
}
```

[official docs]: https://github.com/postcss/postcss#usage
