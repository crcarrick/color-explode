import postcss from 'postcss'
import { expect, test } from 'vitest'

import plugin, { type PluginOptions } from '../lib/main'
import { isColorType } from '../lib/types'

async function run(
  input: string,
  output: string,
  opts: PluginOptions = { prefix: '--color', types: ['#'] },
) {
  const result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

test('handles one color', async () => {
  const input = `
    :root {
      --color-red: #FF0000;
    }
  `

  const output = `
    :root {
      --color-red: #FF0000;
      --color-red-r: 255;
      --color-red-g: 0;
      --color-red-b: 0;
      --color-red-h: 0deg;
      --color-red-s: 100%;
      --color-red-l: 50%;
      --color-red-rgb: 255 0 0;
      --color-red-hsl: 0deg 100% 50%;
    }
  `

  await run(input, output)
})

test('handles multiple colors', async () => {
  const input = `
    :root {
      --color-red: #FF0000;
      --color-green: #00FF00;
      --color-blue: #0000FF;
    }
  `

  const output = `
    :root {
      --color-red: #FF0000;
      --color-green: #00FF00;
      --color-blue: #0000FF;
      --color-red-r: 255;
      --color-red-g: 0;
      --color-red-b: 0;
      --color-red-h: 0deg;
      --color-red-s: 100%;
      --color-red-l: 50%;
      --color-red-rgb: 255 0 0;
      --color-red-hsl: 0deg 100% 50%;
      --color-green-r: 0;
      --color-green-g: 255;
      --color-green-b: 0;
      --color-green-h: 120deg;
      --color-green-s: 100%;
      --color-green-l: 50%;
      --color-green-rgb: 0 255 0;
      --color-green-hsl: 120deg 100% 50%;
      --color-blue-r: 0;
      --color-blue-g: 0;
      --color-blue-b: 255;
      --color-blue-h: 240deg;
      --color-blue-s: 100%;
      --color-blue-l: 50%;
      --color-blue-rgb: 0 0 255;
      --color-blue-hsl: 240deg 100% 50%;
    }
  `

  await run(input, output)
})

test('ignores variables outside of :root', async () => {
  const input = `
    :root {
      --color-red: #FF0000;
    }

    html {
      --color-blue: #0000FF;
    }
  `

  const output = `
    :root {
      --color-red: #FF0000;
      --color-red-r: 255;
      --color-red-g: 0;
      --color-red-b: 0;
      --color-red-h: 0deg;
      --color-red-s: 100%;
      --color-red-l: 50%;
      --color-red-rgb: 255 0 0;
      --color-red-hsl: 0deg 100% 50%;
    }

    html {
      --color-blue: #0000FF;
    }
  `

  await run(input, output)
})

test('ignores variables that do not have color values', async () => {
  const input = `
    :root {
      --color-red: 12px;
    }
  `

  const output = input

  await run(input, output)
})

test('only handles specified color types', async () => {
  const input = `
    :root {
      --color-red: #FF0000;
      --color-green: hsl(120deg 100% 50%);
      --color-blue: rgb(0 0 255);
    }
  `

  const output = `
    :root {
      --color-red: #FF0000;
      --color-green: hsl(120deg 100% 50%);
      --color-blue: rgb(0 0 255);
      --color-red-r: 255;
      --color-red-g: 0;
      --color-red-b: 0;
      --color-red-h: 0deg;
      --color-red-s: 100%;
      --color-red-l: 50%;
      --color-red-rgb: 255 0 0;
      --color-red-hsl: 0deg 100% 50%;
    }
  `

  await run(input, output, { prefix: '--color', types: ['#'] })
})

test.each([
  ['#', '#FF0000'],
  ['hsl', 'hsl(0deg, 100%, 50%)'],
  ['hsla', 'hsla(0deg, 100%, 50%, 1)'],
  ['rgb', 'rgb(255, 0, 0)'],
  ['rgba', 'rgba(255, 0, 0, 1)'],
])('handles %s', async (type, color) => {
  const input = `
    :root {
      --color-red: ${color};
    }
  `

  const output = `
    :root {
      --color-red: ${color};
      --color-red-r: 255;
      --color-red-g: 0;
      --color-red-b: 0;
      --color-red-h: 0deg;
      --color-red-s: 100%;
      --color-red-l: 50%;
      --color-red-rgb: 255 0 0;
      --color-red-hsl: 0deg 100% 50%;
    }
  `

  if (isColorType(type))
    await run(input, output, { prefix: '--color', types: [type] })
})
