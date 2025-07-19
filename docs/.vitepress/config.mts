import { defineConfig } from "vitepress";

// 导入主题的配置
import { blogTheme } from "./blog-theme";

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
    vite: {
        server: {
            watch: {
                ignored: ["**/.vitepress/cache/**"], // 避免监听临时文件
            },
        },
    },
    // 继承博客主题(@sugarat/theme)
    extends: blogTheme,
    // base,
    lang: "zh-cn",
    title: "coderhui",
    description: "代码与逻辑的边角料",
    lastUpdated: true,
    // 详见：https://vitepress.dev/zh/reference/site-config#head
    head: [
        // 配置网站的图标（显示在浏览器的 tab 上）
        // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
        ["link", { rel: "icon", href: "/favicon.ico" }],
    ],
    themeConfig: {
        // 展示 2,3 级标题在目录中
        outline: {
            // level: [2, 3, 4, 5],
            level: "deep",
            label: "目录",
        },
        // 默认文案修改
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "相关文章",
        lastUpdatedText: "上次更新于",

        // 设置logo
        logo: "/logo.png",
        // editLink: {
        //   pattern:
        //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
        //   text: '去 GitHub 上编辑内容'
        // },
        nav: [
            { text: "首页", link: "/" },
            {
                text: "备战春秋",
                items: [
                    { text: "计算机网络", link: "/prepare/network" },
                    { text: "浏览器", link: "/prepare/browser" },
                    { text: "HTML", link: "/prepare/html" },
                    { text: "CSS", link: "/prepare/css" },
                    { text: "Javascript", link: "/prepare/javascript" },
                    { text: "性能优化", link: "/prepare/performance" },
                    { text: "构建工具", link: "/prepare/build" },
                    { text: "Vue", link: "/prepare/vue3" },
                ],
            },
            {
                text: "大前端",
                items: [
                    { text: "CSS", link: "/bigWeb/css" },
                    { text: "JavaScript", link: "/bigWeb/javascript" },
                ],
            },
            {
                text: "技术笔记",
                items: [
                    { text: "学习笔记", link: "/note/learn" },
                    { text: "前端监控", link: "/note/monitor" },
                    { text: "React源码学习", link: "/note/react" },
                    { text: "vue3源码学习", link: "/note/vue3" },
                    { text: "导出PDF", link: "/note/pdf" },
                    { text: "Jenkins自动化部署", link: "/note/jenkins" },
                ],
            },
            { text: "笔试", link: "/write" },
            { text: "面试", link: "/interview" },
            {
                text: "手撕代码",
                link: "/hand-torn-code",
            },
            { text: "线上作品", link: "/works" },
            { text: "关于我", link: "/aboutme" },
        ],
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/Gent1eman",
            },
        ],
    },
});
