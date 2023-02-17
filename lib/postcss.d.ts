import { type Declaration as DeclarationOriginal } from 'postcss'

import { isProcessed } from './utils'

declare module 'postcss' {
  export class Declaration extends DeclarationOriginal {
    [isProcessed]: boolean
  }
}
