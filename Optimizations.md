# Optimizations

- 向下移动`state`
- 内容提升，借助使用`children`
- 一般建议把不依赖 `props` 和 `state` 的函数提到你的组件外面，并且把那些仅被 `effect` 使用的函数放到 `effect` 里面。如果这样做了以后，你的 `effect` 还是需要用到组件内的函数（包括通过 `props` 传进来的函数），可以在定义它们的地方用 `useCallback` 包一层。为什么要这样做呢？因为这些函数可以访问到 `props` 和 `state`，因此它们会参与到数据流中。我们官网的 FAQ 有更详细的答案。

## Reference

- [在你写 memo()之前](https://overreacted.io/zh-hans/before-you-memo/)
- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)
