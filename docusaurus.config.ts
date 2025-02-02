const { themes: prismThemes } = require('prism-react-renderer');

const config = {
  title: 'kig.wiki',
  tagline: 'Very WIP, please wait warmly',
  favicon: 'icons/favicon.ico',

  // Set the production url of your site here
  url: 'https://kig.wiki',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kig-wiki', // username for deployed site and repo.
  projectName: 'kigwiki',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/kig-wiki/kigwiki/blob/master/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    // Replace with your project's social card
    image: 'icons/kigwiki.png',
    navbar: {
      title: 'Kigwiki',
      logo: {
        alt: 'Kigwiki Logo',
        src: 'icons/kigwiki.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Get Started',
        },
        {to: 'about', label: 'About', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/docs/what-is-kigurumi',
            },
          ],
        },
        {
          title: 'Other Links',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/kig-wiki/kigwiki',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Animegao Specific Resources',
              href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kig.wiki | Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    headTags: [
      {
        tagName: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'mask-icon',
          href: '/icons/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'msapplication-TileColor',
          content: '#2b5797',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'theme-color',
          content: '#ffffff',
        },
      },
    ],
  },

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en', 'ja'],
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/icons/kigwiki.png',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#5b4a91',
          },
        ],
      },
    ],
  ],
};

module.exports = config;
