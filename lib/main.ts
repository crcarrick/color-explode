import Color from 'color'
import { Declaration, type PluginCreator } from 'postcss'

import { type ColorType, type Prefixed } from './types'
import { isColorVariable, isProcessed } from './utils'

export type PluginOptions = {
  readonly types: ColorType[]
  readonly prefix: Prefixed<'--'>
}

const DEFAULT_OPTIONS: PluginOptions = {
  prefix: '--color',
  types: ['#', 'hsl', 'hsla', 'rgb', 'rgba'],
}

const plugin: PluginCreator<Partial<PluginOptions>> = ({
  prefix = DEFAULT_OPTIONS.prefix,
  types = DEFAULT_OPTIONS.types,
}: Partial<PluginOptions> = {}) => {
  return {
    postcssPlugin: 'color-explode',

    Declaration(decl) {
      if (isColorVariable(decl, prefix, types)) {
        const color = new Color(decl.value)
        const [r, g, b] = color.rgb().array()
        const [h, s, l] = color.hsl().array()

        const decls = [
          { prop: 'r', value: r },
          { prop: 'g', value: g },
          { prop: 'b', value: b },
          { prop: 'h', value: `${h}deg` },
          { prop: 's', value: `${s}%` },
          { prop: 'l', value: `${l}%` },
          { prop: 'rgb', value: `${r} ${g} ${b}` },
          { prop: 'hsl', value: `${h}deg ${s}% ${l}%` },
        ]

        decls.forEach(({ prop, value }) => {
          decl[isProcessed] = true

          decl.parent.append(
            new Declaration({
              prop: `${decl.prop}-${prop}`,
              value: `${value}`,
            }),
          )
        })
      }
    },
  }
}

plugin.postcss = true

export default plugin
