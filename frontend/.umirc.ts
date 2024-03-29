import { defineConfig } from '@umijs/max';

const PROJECT_NAME = 'makoto';

export default defineConfig({
  alias: {
    '@': '/src',
  },
  antd: {
    appConfig: {},
  },
  access: {},
  define: {
    DEV_HOCUSPOCUS_ENDPOINT: 'ws://127.0.0.1:12345',
    PROJECT_NAME,
  },
  model: {},
  initialState: {},
  request: {},
  mock: false,
  proxy: {
    '/api': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  layout: {
    title: PROJECT_NAME,
  },
  routes: [
    {
      path: '/',
      redirect: '/space',
    },
    {
      name: '我的空间',
      path: '/space',
      component: './Space',
      icon: 'icon-home-fill',
    },
    {
      name: '管理文件',
      path: '/file-manage',
      component: './ManageFile',
      hideInMenu: true,
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      headerRender: false,
      footerRender: false,
      menuRender: false,
      hideInMenu: true,
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      headerRender: false,
      footerRender: false,
      menuRender: false,
      hideInMenu: true,
    },
    {
      name: '编辑文档',
      path: '/doc',
      component: './Doc',
      hideInMenu: true,
      target: '_blank',
    },
    {
      name: '分享',
      path: '/share',
      icon: 'icon-share',
      routes: [
        {
          name: '我创建的分享',
          path: '/share/own',
          component: './OwnShares',
        },
        {
          name: '我收藏的分享',
          path: '/share/fav',
          component: './FavShares',
        },
        {
          name: '最近访问的分享',
          path: '/share/recent',
          component: './RecentShares',
        },
        {
          name: '查看分享',
          path: '/share/:id',
          component: './Share',
          target: '_blank',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '回收站',
      path: '/recycle-bin',
      component: './RecycleBin',
      icon: 'icon-delete-fill',
    },
    {
      name: '个人信息',
      path: '/profile',
      component: './MyProfile',
      icon: 'icon-user',
    },
  ],
  npmClient: 'yarn',
});
