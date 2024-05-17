import { execSync } from 'node:child_process'
import { defineConfig } from 'wxt'
import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import icons from 'unplugin-icons/vite'
import Randomstring from 'randomstring'
import mdx from '@mdx-js/rollup'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import remarkUnwrapImages from 'remark-unwrap-images'
import { version as versionReact } from 'react'
import { version as versionMui } from '@mui/material/package.json'
import { version as helperVersion } from './package.json'
// eslint-disable-next-line antfu/no-import-node-modules-by-path
import { version as versionThuLearnLib } from './node_modules/thu-learn-lib/package.json'

const randomSuffix = Randomstring.generate(4)
const r = (cmd: string) => execSync(cmd).toString().trim()
const j = JSON.stringify

export default defineConfig({
  srcDir: 'src',
  root: '.',
  entrypointsDir: '../entry',
  publicDir: '../public',

  vite: () => ({
    define: {
      __HELPER_VERSION__: j(helperVersion),
      __GIT_VERSION__: j(r('git describe --always --dirty')),
      __THU_LEARN_LIB_VERSION__: j(versionThuLearnLib),
      __MUI_VERSION__: j(versionMui),
      __REACT_VERSION__: j(versionReact),

      __GIT_COMMIT_HASH__: j(r('git rev-parse HEAD')),
      __GIT_COMMIT_DATE__: j(r('git log -1 --date=format:"%Y/%m/%d %T" --format="%ad"')),
      __GIT_BRANCH__: j(r('git rev-parse --abbrev-ref HEAD')),
      __BUILD_HOSTNAME__: j(r('hostname')),
      __BUILD_TIME__: j((new Date()).toLocaleString('zh-CN')),

      __LEARN_HELPER_CSRF_TOKEN_PARAM__: j(`__learn-helper-csrf-token-${randomSuffix}__`),
      __LEARN_HELPER_CSRF_TOKEN_INJECTOR__: j(`__learn_helper_csrf_token_injector_${randomSuffix}__`),
    },

    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkUnwrapImages],
          rehypePlugins: [rehypeMdxImportMedia],
        }),
      },
      react({ plugins: [['@lingui/swc-plugin', {}]] }),
      icons({ compiler: 'jsx', jsx: 'react' }),
      lingui(),
    ],

    build: {
      minify: 'terser',
      sourcemap: import.meta.env.MODE === 'development',
      terserOptions: {
        format: {
          comments: false,
          ecma: 2018,
        },
      },
    },
  }),

  manifest: {
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'zh_CN',
    action: {
      default_icon: {
        19: 'icons/19.png',
      },
      default_title: '__MSG_appName__',
    },
    host_permissions: ['*://learn.tsinghua.edu.cn/*', '*://id.tsinghua.edu.cn/*'],
    permissions: [
      'storage',
      'downloads',
      'declarativeNetRequest',
    ],
  },
})
