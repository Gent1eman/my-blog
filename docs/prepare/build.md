# 构建工具

## webpack loader 和 plugin 的不同，用过哪些 loader 和 plugin

loader 和 plugin 都是 webpack 中用来扩展其功能的工具，但它们的用途和工作方式不同。

1. **Loader**：它主要用于转换某些类型的模块，比如将 Scss 转为 CSS，或将图片转换为 DataURL。loader 是在 import 或者加载模块的时候预处理文件的，也就是说，它可以操作文件内容。比如，babel-loader 可以把 ES6 代码转换为 ES5 代码。

:::info
loader 是对模块源代码的转换。

:::

2. **Plugin**：它则用于 webpack 构建过程的其它事情，比如优化打包体积、资源管理或者注入环境变量等。plugin 可以在 webpack 的整个生命周期插入钩子，执行更广泛的任务，比如 HtmlWebpackPlugin 可以自动生成 HTML 文件，并引入打包后的 JavaScript 文件和 CSS 文件。

:::info
plugin 是对整个构建流程的扩展和增强。

:::

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">常用的 loader：</font>**

1. `Balel Loader`：用于将 ES6+代码转译为向后兼容的 JavaScript 语法，以便在就浏览器中运行。
2. `CSS Loader`：用于加载 CSS 文件，并解析 CSS 中的 `@import` 等语句，将 CSS 模块化处理。
3. `File Loader`：用于处理图片、字体等资源文件，将其复制到输出目录并返回访问路径。
4. `URL Loader`：与 File Loader 类似，但在文件大小低于限制时会将文件转为 Base64 编码的 Data Url，减少 HTTP 请求。
5. `SCSS Loader`：用于加载和编译 SCSS 文件为 CSS 文件，配合 CSS Loader 和 Style Loader 使用。
6. `Vue Loader`：用于处理 Vue.js 单文件组件（.vue 文件），将其模块、脚本和样式部分分别编译和处理。
7. `Less Loader`：用于加载和编译 Less 文件为 CSS 文件。

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">常用的 plugin：</font>**

1. `HtmlWebpackPlugin`：用于自动生成 HTML 文件，并将打包后的 JS、CSS 文件自动引入到 HTML 中，简化开发流程。
2. `CleanWebpackPlugin`：用于在每次打包前清空输出模块，避免旧文件残留导致的混淆。
3. `MiniCssExtractPlugin`：用于将 CSS 代码从 JS 文件中提取出来，生成单独的 CSS 文件，便于缓存和性能优化。
4. `DefinePlugin`：用于定义全局常量，可以在代码中通过 `process.env.NODE_ENV` 等变量获取构建时的环境信息。
5. `DllPlugin`：用于将第三方库提前打包为动态链接库，减少主应用的打包时间和体积。
6. `CopyWebpackPlugin`：用于将指定的静态资源文件复制到输出目录，适用于一些不需要处理的资源文件。
7. `TerserPlugin`：用于压缩 JavaScript 代码，去除无用代码和注释，缩短变量名等，减少文件体积。
8. `OptimizedImagePlugin`：用于优化图片资源，如压缩图片大小、转换图片格式等，提升加载性能。

## tree shaking 是什么

Tree Shaking 是一种用于优化 JavaScript 代码的技术，它通过静态分析代码的引用关系，将未被使用的代码（即死代码）从最终的构建结果中排除，从而减小代码的体积，提升应用程序的性能。

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">Tree Shaking 工作原理：</font>**

Tree Shaking 的实现依赖于 ES6 模块的静态特性。ES6 的 import 和 export 语法是静态的，这意味着在代码运行之前就可以确定模块之间的依赖关系。具体来说，Tree Shaking 的实现过程可以分为以下三个步骤：

1. **<font style="color:#2F4BDA;">解析代码生成 AST</font>**：使用如 Acorn 等解析器将代码解析成抽象语法树（AST），这样可以更方便的分析代码结构。
2. **<font style="color:#2F4BDA;">遍历 AST 记录相关信息</font>**：通过遍历 AST，找出代码中定义的函数、变量以及它们的引用情况，确定哪些代码是被使用的，哪些是未被使用的。
3. **<font style="color:#2F4BDA;">根据记录生成新代码</font>**：基于上一步的分析结果，生成新代码，将未被使用的代码从最终的打包文件中移除。

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">tree shaking 使用条件：</font>**

要实现 tree shaking，代码需要满足以下条件：

-   使用 ES6 模块导入导出语法。
-   不能有副作用，也就是说，代码中不能有无法跟踪的引用。

**<font style="color:#ECAA04;">好处</font>**：通过 tree shaking，可以移除那些未使用的代码，从而减少应用的加载时间和提高性能。

**<font style="color:#ECAA04;">实践</font>**：在 Webpack 中，可以通过配置 mode: “production”和相应的插件来实现 tree shaking。

## vite 和 webpack 的对比

1. <font style="color:#ECAA04;">性能方面</font>
    - <font style="color:#2F4BDA;">开发服务器启动速度</font>：
        - Vite 的启动速度极快，通常在几秒内即可完成冷启动；
        - Webpack 需要解析整个项目依赖并进行打包，启动速度相对较慢。
    - <font style="color:#2F4BDA;">热更新速度（HMR）</font>：
        - Vite 的热更新速度极快，得益于其按需加载和预编译技术，每次修改代码后几乎可以立即看到效果；
        - Webpack 的热更新在大型项目中速度较慢。
    - <font style="color:#2F4BDA;">构建速度</font>：
        - Vite 在生产环境下的构建速度相对较快，特别是在处理大型项目时；
        - Webpack 的构建速度受项目大小和配置复杂度影响较大。
    - <font style="color:#2F4BDA;">资源占用</font>：
        - Vite 的资源占用相对较少；
        - Webpack 在构建过程中需要占用较多的内存和 CPU 资源，特别是在处理大型项目时。
2. <font style="color:#ECAA04;">开发模式</font>
    - <font style="color:#2F4BDA;">Webpack</font>：通常使用热模块替换（HMR）来实现快速开发模式，但配置相对复杂。
    - <font style="color:#2F4BDA;">Vite</font>：采用了基于 ES Module 的开发服务器，只有在需要时才会编译对应的模块，大幅度提升了开发环境的响应速度。
3. <font style="color:#ECAA04;">配置复杂度</font>
    - <font style="color:#2F4BDA;">Webpack</font>：配置相对复杂，特别是在处理不同类型的资源和加载器时，需要针对具体项目进行不同的配置。
    - <font style="color:#2F4BDA;">Vite</font>：在设计上更注重开箱即用，大部分场景下用户无需自己写配置文件，但同时也支持自定义配置。
4. <font style="color:#ECAA04;">插件生态</font>
    - <font style="color:#2F4BDA;">Webpack</font>：用于庞大的插件生态系统，适用于不同的需求。
    - <font style="color:#2F4BDA;">Vite</font>：插件生态相对较小，因为它的开发模式和构建方式减少了对一些传统插件的需求。
5. <font style="color:#ECAA04;">适用场景</font>
    - <font style="color:#2F4BDA;">Webpack</font>：适用于大型复杂项目，特别时需要细粒度控制构建输出、缓存和资源管理的项目。
    - <font style="color:#2F4BDA;">Vite</font>：更适合中小型项目，特别是使用 vue3、react 等现代前端框架的项目，以及追求更快开发体验的静态网站和前端独立项目。

谈一下发展趋势：vite 凭借快速的开发体验正在逐渐流行，但 webpage 在大型项目中的地位依然稳固。

## webpack 和 vite 打包过程

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">Webpack 打包过程：</font>**

1. **<font style="color:#2F4BDA;">初始化</font>**：解析 Webpack 配置文件，注册各种插件和加载器。
2. **<font style="color:#2F4BDA;">模块解析</font>**：根据入口文件，递归地解析项目中的所有模块依赖，构建模块依赖图。
3. **<font style="color:#2F4BDA;">加载模块</font>**：使用配置的 loader 对模块进行转换和处理，如将 TypeScript 转换为 JavaScript。
4. **<font style="color:#2F4BDA;">构建模块图</font>**：将所有模块及其依赖关系构建成一个模块图，包含模块的代码、依赖等信息。
5. **<font style="color:#2F4BDA;">优化模块</font>**：对模块进行优化，如代码分割、删除未使用的代码（Tree shaking）等。
6. **<font style="color:#2F4BDA;">生成代码</font>**：根据优化后的模块图，生成最终的打包文件代码。
7. **<font style="color:#2F4BDA;">输出文件</font>**：将生成的代码输出到指定的目录，完成打包过程。

**<font style="color:rgb(44, 62, 80);background-color:#C1E77E;">Vite 打包过程：</font>**

1. **<font style="color:#2F4BDA;">开发服务器启动</font>**：Vite 在开发阶段启动一个基于 ES Module 的开发服务器，利用原生 ESM 的导入机制，只有在需要时才会加载和转换模块。
2. **<font style="color:#2F4BDA;">模块热更新（HMR）</font>**：在开过程中，修改模块时，Vite 只重新加载修改的模块，而不会刷新整个页面，实现快速的热更新。
3. **<font style="color:#2F4BDA;">生产构建</font>**：在生产环境下，Vite 会将项目中的模块进行预编译，生成优化后的静态资源文件。
4. **<font style="color:#2F4BDA;">代码分割和优化</font>**：Vite 根据路由和组件的导入关系，自动进行代码分割，减少初始加载的文件大小。
5. **<font style="color:#2F4BDA;">资源处理</font>**：处理项目中的静态资源，如图片、字体等，生成对应的引用路径。
6. **<font style="color:#2F4BDA;">生成静态文件</font>**：将预编译后的模块和处理后的资源文件生成最终的静态文件，完成打包过程。
