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
      // 不展示顶栏
      headerRender: false,
      // 不展示页脚
      footerRender: false,
      // 不展示菜单
      menuRender: false,
      // 隐藏自己和子菜单
      hideInMenu: true,
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      // 不展示顶栏
      headerRender: false,
      // 不展示页脚
      footerRender: false,
      // 不展示菜单
      menuRender: false,
      // 隐藏自己和子菜单
      hideInMenu: true,
    },
  ],
  npmClient: 'yarn',
});
