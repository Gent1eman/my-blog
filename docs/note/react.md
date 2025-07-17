# React 源码学习

## 1 实现 JSX 转换

### 1.1 前置知识

先来看一下这样一段代码

```javascript
const title = <h1 className="title">Hello, world!</h1>;
```

这段代码并不是合法的 js 代码，它是一种被称为 jsx 的语法扩展，通过它我们可以很方便的在 js 代码中书写 html 片段。

本质上，jsx 是语法糖，上面这段代码会被 babel 转换成如下代码：

```javascript
const title = /*#__PURE__*/ React.createElement(
    "h1",
    {
        className: "title",
    },
    "Hello, world!"
);
```

在 babel 中将`React Runtime`的值改为`Automatic`，那么调用的就是`_jsx`方法，对于上述同样的代码，转换之后如下：

```javascript
import { jsx as _jsx } from "react/jsx-runtime";
const title = /*#__PURE__*/ _jsx("h1", {
    className: "title",
    children: "Hello, world!",
});
```

<big>接下来就手写`React.createElement`构造函数。</big>

### 1.2 实现 React.createElement

从 jsx 的转移结果来看，createElement 方法的参数大概是这样的：

```javascript
React.createElement(type,config,child1,child2,child3 ...)
// 最终可以设计为：
/**
 * type 标签类型，可能div，h1，span等等
 * config 属性配置，可能包含了className，id等等
 * child 子节点
 */
React.createElement(type,config,...child)
```

完整的代码实现：

```javascript
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
    Type,
    Key,
    Ref,
    Props,
    ReactElementType,
    ElementType,
} from "shared/ReactTypes";

// ReactElement构造函数
/**
 *
 * @param type
 * @param key
 * @param ref
 * @param props
 */
const ReactElement = function (
    type: Type,
    key: Key,
    ref: Ref,
    props: Props
): ReactElementType {
    const element = {
        // 私有变量
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
        __mark: "hui", // 真实React项目中没有这个字段
    };

    return element;
};

/**
 *
 * @param type 标签类型，可能div，h1，span等等
 * @param config 属性配置，可能包含了className，id等等
 * @param children 子节点
 * @returns react element
 */
export const jsx = (type: ElementType, config: any, ...children: any) => {
    let key: Key = null;
    const props: Props = {};
    let ref: Ref = null;

    for (const prop in config) {
        const val = config[props];
        if (prop === "key") {
            if (val !== undefined) {
                key = "" + val;
            }
            continue;
        }
        if (prop === "ref") {
            if (val !== undefined) {
                ref = "" + val;
            }
            continue;
        }
        // 判断是不是config自己的prop，如果是原型上就不复制给props
        if (Object.hasOwnProperty.call(config, prop)) {
            props[prop] = val;
        }
    }

    const childrenLength = children.length;
    if (children > 0) {
        // 情况1：长度等于1 child
        if (childrenLength === 1) {
            props.children = children[0];
        }
        // 情况2：长度大于1 [child, child, child]
        else {
            props.children = children;
        }
    }

    return ReactElement(type, key, ref, props);
};
```

:::info
这里的 jsx 就是 React.createElement 函数，在 react17 之前调用的是 React.createElement 方法，在 react17 之后调用的就是 \_jsx 方法
:::

## 2 Fiber 架构

### 2.1 Fiber 的目标

设计 Fiber 架构的主要目标是：

-   **提升性能**：通过增量渲染和任务切片等技术，显著降低长时间渲染任务对用户体验的影响。
-   **灵活性和扩展性**：Fiber 架构为未来的新特性和优化奠定了基础，例如 Concurrent Mode 和 Suspense，这些特性能够进一步提升 React 应用的性能和开发体验。
-   **可维护性和可调式性**：新的架构不仅提升了性能，还改进了 React 内部的代码结构，使得调试和维护更加容易。

通过引入 Fiber 架构，React 在处理复杂和高频更新场景下的性能和用户体验方面取得了显著进步。

### 2.2 Fiber 架构的机构概念

**什么是 Fiber ？**

在 React 中，Fiber 是一种用于描述组件树的数据结构，它代表了一个可中断的、可恢复的渲染任务。传统的渲染过程是递归式的，一旦开始渲染，就无法中断，直到渲染完成或发生错误。

而 Fiber 架构将渲染过程分解成多个小任务，使得在渲染过程中可以中断，并且可以根据需要重新调度任务。Fiber 的引入使得 React 应用能够更好地利用浏览器的空闲时间，提升性能和用户体验。

**Fiber 是一种数据结构**

```typescript
export class FiberNode {
    type: any;
    tag: WorkTag;
    pendingProps: Props;
    key: Key;
    stateNode: any;

    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;

    ref: Ref;

    memoizedProps: Props | null;
    memoizedState: any;
    updateQueue: unknown;

    /**
     * alternate作用：指向备用Fiber的指针，用于双缓冲
     * 当所有的React Element比较完后，会生成一颗fiberNode树，一共会存在两棵fiberNode树
     * - current：与视图中真实UI对应的fiberNode树
     * - workInProgress：触发更新后，正在reconciler中计算的fiberNode树
     */
    // 比如当前的fiberNode是current，那么alternate指向workInProgress
    // 当前的fiber是workInProgress，那么alternate指向current
    alternate: FiberNode | null; // 指向备用Fiber的指针，用于双缓冲

    flags: Flags; //描述此Fiber需要执行的工作类型的位字段

    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // 实例信息字段
        this.tag = tag;
        this.key = key;
        this.stateNode = null; // 比如HostComponent <div>  stateNode就是div DOM
        this.type = null; // 比如是FunctionComponent type就是函数本身()=>{}

        // Fiber树结构指针字段
        this.return = null; // 指向父fiberNode，相当于栈帧的返回地址
        this.sibling = null; // 指向下一个兄弟fiberNode
        this.child = null; // 指向第一个子fiberNode
        this.index = 0; // 在父节点中的索引位置 ，比如在父节点ul中有3个li节点，索引从0开始

        // Ref相关字段
        this.ref = null; // 用于附加此节点的ref引用

        // 作为工作单元 Props和State字段
        this.pendingProps = pendingProps; //  即将处理的新props（工作单元刚开始准备工作的时候props是什么）
        this.memoizedProps = null; // 用于创建输出的已记忆props（工作单元工作完成之后的props是什么，也就是确定下来的props是什么）
        this.memoizedState = null; // 当前的组件状态
        this.updateQueue = null; // 待处理的状态更新队列

        // 调度相关字段
        this.alternate = null; // 指向备用Fiber的指针，用于双缓冲

        // 副作用相关字段
        this.flags = NoFlags; // 描述此Fiber需要执行的工作类型的位字段
    }
}
```
