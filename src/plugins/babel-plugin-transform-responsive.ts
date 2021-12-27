import type { PluginObj } from '@babel/core'
import { Identifier, NumericLiteral } from '@babel/types'
import type { StandardProperties } from 'csstype'

// type Babel = typeof babel
/**
 * RN样式中支持的属性
 * FIXME 排除一些维度相关的属性
 */
type CssProperty = keyof Omit<StandardProperties, ''> | 'paddingHorizontal' | 'paddingVertical'
export interface PluginOptions {
  /**
   * 样式文件名称
   */
  filename?: string | string[]
  /**
   * 最小值
   */
  minValue: number
  /**
   * 需要排除的属性
   */
  excludes?: CssProperty[]
  /**
   * 转换函数
   */
  transformfn: (value: number) => number
}
/**
 * 仅处理style中样式响应问题
 * 1、样式文件
 * 2、响应式转换方法
 * 3、排除特殊值
 */
export default (): PluginObj => {
  return {
    visitor: {
      ObjectProperty(path, state) {
        const filename = state.file.opts.filename
        if (!filename) {
          return
        }
        const options = state.opts as PluginOptions
        const optionsFilename = Array.isArray(options.filename)
          ? options.filename
          : options.filename
          ? [options.filename]
          : ['style.ts']
        if (!optionsFilename.some(file => filename.endsWith(file))) {
          return
        }
        const excludes = options.excludes ? [...options.excludes, 'flex'] : ['flex']
        if (excludes.includes((path.node.key as Identifier).name)) {
          return
        }
        const literal = path.node.value as NumericLiteral
        if (literal && !isNaN(literal.value)) {
          literal.value = options.transformfn(literal.value)
        }
      },
    },
  }
}
