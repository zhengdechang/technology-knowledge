/*
 * @Description:
 * @Author: Devin
 * @Date: 2023-09-06 13:28:38
 */
module.exports = [
  { text: "首页", link: "/" },
  {
    text: "前端",
    link: "/frontend/", //目录页，vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
      {
        text: "前端文章",
        items: [
          { text: "JavaScript", link: "/pages/a9d0ad/" },
          { text: "React", link: "/pages/bf2b12/" }, // 注意link结尾有斜杠和没有斜杠的区别
          { text: "Vue", link: "/pages/90295c/" },
        ],
      },
      {
        text: "学习笔记",
        items: [
          { text: "《JavaScript教程》笔记", link: "/note/javascript/" },
          { text: "《ES6 教程》笔记", link: "/note/es6/" },
          { text: "《Vue》笔记", link: "/note/vue/" },
          {
            text: "《TypeScript 从零实现 axios》",
            link: "/note/typescript-axios/",
          },
          { text: "小程序笔记", link: "/note/wx-miniprogram/" },
        ],
      },
    ],
  },
  {
    text: "后端",
    link: "/backend/",
    items: [
      { text: "Node", link: "/pages/8309a5b876fc95e3/" },
      { text: "Python", link: "/pages/0a83b083bdf257cb1/" },
      { text: "Sanic", link: "/pages/411014/" },
    ],
  },
  {
    text: "其他技术",
    link: "/technology/",
    items: [
      { text: "技术文档", link: "/pages/9a7ee40fc232253e/" },
      { text: "GitHub技巧", link: "/pages/4c778760be26d8b3/" },
      { text: "Nodejs", link: "/pages/117708e0af7f0bd9/" },
      { text: "博客搭建", link: "/pages/41f87d890d0a02af/" },
    ],
  },
  { text: "归档", link: "/archives/" },
];
