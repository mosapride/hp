const { description } = require('../../package');

const { Base64 } = require('js-base64');
const uslugify = (s) => Base64(s);

const url = "https://v-kurore.com/";

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Kuro Doc',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  port: 9090,

  locales: {
    '/': {
      lang: 'ja',
    },
  },
  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/favicon180x180.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicons/favicon16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicons/favicon32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicons/favicon48x48.png',
      },
    ],
    ['link', { rel: 'shortcut icon', href: '/favicons/favicon.ico' }],
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' },],
    ['meta', { name: 'theme-color', content: '#4a4a4a' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    domain: 'https://v-kurore.com',
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: '箱庭Doc',
        link: '/hako/',
      },
      {
        text: 'TypeScript',
        link: '/TypeScript/',
      },
      {
        text: 'Angular',
        link: '/Angular/',
      },
      {
        text: 'Other',
        ariaLabel: 'Language Menu',
        items: [
          { text: 'HTML&CSS', link: '/htmlcss/' },
          { text: 'Docker&Linux', link: '/dockerLinux/' },
          { text: 'チラシの裏', link: '/blog/' },
        ],
      },
    ],
    sidebar: {
      '/hako/': [
        {
          title: '箱庭Doc',
          collapsable: false,
          initialOpenGroupIndex: -1,
          sidebarDepth: 0,
          children: [
            '',
            'profile',
            'minecraft',
            'minecraft-term',
            'minecraft-mod',
            'change-skin',
          ],
        },
      ],
      '/TypeScript/': [
        {
          title: 'TypeScript',
          collapsable: false,
          initialOpenGroupIndex: -1,
          sidebarDepth: 0,
          children: [
            '',
            'developmentEnvironmentInfo',
            'developmentEnvironment',
            'devEnd',
            'classConstractor',
            'arrayReduce',
            'arraySort'
          ],
        },
      ],
      '/Angular/': [
        {
          title: 'Angular',
          collapsable: false,
          initialOpenGroupIndex: -1,
          sidebarDepth: 0,
          children: [
            '',
            'vscode',
            'showCode',
            'ngnew',
            'styleCoding',
            'class_style',
            'bindingInput',
            'httpclient',
            'datePipe',
            'outerScript',
            'svgIconDrective',
            'ogp',
            'lazy-scroll'
          ],
        },
      ],
      '/htmlcss/': [
        {
          title: 'HTML&CSS',
          collapsable: false,
          children: [''],
        },
      ],
      '/dockerLinux/': [
        {
          title: 'Docker&Linux',
          collapsable: false,
          children: ['', 'command'],
        },
      ],
      '/blog/': [
        {
          title: 'blog',
          collapsable: false,
          children: ['', 'fledglingEngineer', 'server', 'oauth', 'randomPassword'],
        },
      ],
    },
    repo: 'mosapride/hp',
    repoLabel: 'GitHub',
    docsRepo: 'mosapride/hp',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'GitHub',
  },
  markdown: {
    lineNumbers: true,
    anchor: {
      permalink: false
    },
    toc: {
      includeLevel: [1]
    },
    extendMarkdown: (md) => {
      md.set({ breaks: false });
      md.use(require('markdown-it-imsize'));
      md.use(require('markdown-it-anchor'), {
        slugify: uslugify,
      });
      md.disable(['link']);
      md.enable(['link']);
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/medium-zoom',
    'vuepress-plugin-smooth-scroll',
    'vuepress-plugin-redirect',
    ["sitemap",
      {
        hostname: "https://v-kurore.com",
        changefreq: "weekly"
      },
    ],
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10,
      },
    ],
    {
      locales: true,
    },
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor',
      },
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-24357312-11',
      },
    ],
    [
      'seo',
      {
        description: $page => $page.frontmatter.description,
        title: ($page, $site) => {
          // console.log($page.regularPath, $page.title || $site.title);
          var title = '';
          if ($page.regularPath.indexOf('/hako') === 0) {
            title = '箱庭Doc';
          }
          if ($page.regularPath.indexOf('/TypeScript') === 0) {
            title = 'TypeScript';
          }
          if ($page.regularPath.indexOf('/Angular') === 0) {
            title = 'Angular';
          }
          if ($page.regularPath.indexOf('/blog') === 0) {
            title = 'blog';
          }
          if ($page.regularPath.indexOf('/dockerLinux') === 0) {
            title = 'Docker & Linux';
          }
          if ($page.regularPath.indexOf('/htmlcss') === 0) {
            title = 'HTML + CSS';
          }
          if (title === '') {
            return '完全に理解したドキュメント | Kuro Doc '
          } else {
            return $page.title + ' | Koro Doc + ' + title;
          }
        },
        image: ($page, $site) =>
          ($page.frontmatter.image &&
            ($site.themeConfig.domain || '') + $page.frontmatter.image) ||
          'http://placehold.jp/26/525252/ffffff/600x315.png?css=%7B%22background-image%22%3A%22%20url(https%3A%2F%2Fv-kurore.com%2Ffavicons%2Ffavicon180x180.png)%22%2C%22background-position%22%3A%22%20right%20bottom%22%2C%22background-repeat%20%20%22%3A%22%20no-repeat%22%7D&&text=' +
          encodeURIComponent($page.title || $site.title),
      },
    ],
  ],
};
