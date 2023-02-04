import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
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
    title: 'makoto',
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
    },
    {
      name: '查看分享',
      path: '/share',
      component: './Share',
      hideInMenu: true,
    },
  ],
  npmClient: 'yarn',
});
