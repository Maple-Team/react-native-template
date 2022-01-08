# 翻译资源说明

> 出发点：避免单个资源文件过大引起的难以维护的问题

## `field.json`

表单相关的字段，类型如下：

```ts
interface Field {
  /**
   * 展示文字
   * 基于设计，可能无此属性
   */
  label?: sting
  /**
   * 占位符提示文字
   */
  placeholder: sting
  /**
   * 输入无效时的提示
   * 有些字段无此属性
   */
  invalid?: sting
  /**
   * 未输入时的提示
   */
  required: sting
}
```

## `apply.json`

业务相关的文案，如进件、订单、还款等

## `common.json`

全局通用的文案

## `user.json`

用户相关的文案

## `misc.json`

一些营销等不好分类的文案
