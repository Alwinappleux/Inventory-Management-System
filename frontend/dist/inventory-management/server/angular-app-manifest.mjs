
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/product"
  },
  {
    "renderMode": 2,
    "route": "/navbar"
  },
  {
    "renderMode": 2,
    "route": "/add-product"
  },
  {
    "renderMode": 2,
    "route": "/add-user"
  },
  {
    "renderMode": 2,
    "route": "/user-list"
  },
  {
    "renderMode": 2,
    "route": "/supplier"
  },
  {
    "renderMode": 2,
    "route": "/add-sales"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WZ4XBODP.js"
    ],
    "route": "/sales-list"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 832, hash: '6454d15a943d2c25184b158d149c255b99ba17027d734c42ca3b75fc5fe79287', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1067, hash: 'aa301ba12258d786a50b4abf3b061dc063591c49e448ea8eb5ea0320ca89609e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'navbar/index.html': {size: 4328, hash: '5e369bbe4be4ef4875b6218941708baa70ecb5c8066cff6e7c6f0ff419b5171f', text: () => import('./assets-chunks/navbar_index_html.mjs').then(m => m.default)},
    'add-user/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/add-user_index_html.mjs').then(m => m.default)},
    'add-product/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/add-product_index_html.mjs').then(m => m.default)},
    'user-list/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/user-list_index_html.mjs').then(m => m.default)},
    'product/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/product_index_html.mjs').then(m => m.default)},
    'supplier/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/supplier_index_html.mjs').then(m => m.default)},
    'add-sales/index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/add-sales_index_html.mjs').then(m => m.default)},
    'index.html': {size: 4498, hash: '753988a5fa1064eced826b464531a3220af5ce7e17c730bfade5dfe8deb73f09', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'sales-list/index.html': {size: 4551, hash: '7a3940b03883a3be3f607c6a659c5e137852b194a33047cb52e408b934404b82', text: () => import('./assets-chunks/sales-list_index_html.mjs').then(m => m.default)},
    'styles-QWZMA2CR.css': {size: 615, hash: 'EwOjOWnna3M', text: () => import('./assets-chunks/styles-QWZMA2CR_css.mjs').then(m => m.default)}
  },
};
