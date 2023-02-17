import {
  type ChildNode,
  type Container,
  type Declaration,
  type Rule,
} from 'postcss'

import { type ColorType, type Prefixed, type RuleChild } from './types'

export const isProcessed = Symbol('isProcessed')

function isRule(node?: Container<ChildNode>): node is Rule {
  return node?.type === 'rule'
}

function isRootChild(decl: Declaration) {
  if (!isRule(decl.parent)) return false

  return decl.parent.selector === ':root'
}

export function isColorVariable(
  decl: Declaration,
  prefix: Prefixed<'--'>,
  types: ColorType[],
): decl is RuleChild {
  if (!isRootChild(decl)) return false

  return (
    decl.variable &&
    decl[isProcessed] !== true &&
    decl.prop.startsWith(prefix) &&
    types.some((prefix) => decl.value.startsWith(prefix))
  )
}
