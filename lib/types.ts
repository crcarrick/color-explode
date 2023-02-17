import { type Declaration as PostCSSDeclaration, type Rule } from 'postcss'

const colorTypeSet = new Set(['#', 'rgb', 'hsl', 'rgba', 'hsla'] as const)

export function isColorType(val: string): val is ColorType {
  return Set.prototype.has.call(colorTypeSet, val)
}

export type ColorType = typeof colorTypeSet extends Set<infer T> ? T : never

export type Prefixed<T extends string> = `${T}${string}`

export type RuleChild = PostCSSDeclaration & {
  readonly parent: Rule
}
