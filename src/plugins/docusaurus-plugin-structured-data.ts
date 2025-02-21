import type { LoadContext, Plugin } from '@docusaurus/types';
import type { ThemeConfig } from '@docusaurus/preset-classic';

interface StructuredDataConfig {
  excludedRoutes?: string[];
  verbose?: boolean;
  organization?: {
    sameAs?: string[];
    logo?: {
      '@type': string;
      inLanguage: string;
      '@id': string;
      url: string;
      contentUrl: string;
      width: number;
      height: number;
    };
    [key: string]: any;
  };
  website?: {
    inLanguage?: string;
    [key: string]: any;
  };
  webpage?: {
    inLanguage?: string;
    datePublished?: string;
    [key: string]: any;
  };
  breadcrumbLabelMap?: {
    [key: string]: string;
  };
}

interface DocusaurusConfig extends ThemeConfig {
  structuredData?: StructuredDataConfig;
}

interface PluginOptions {
  [key: string]: unknown;
}

interface ContentItem {
  permalink: string;
  title?: string;
  description?: string;
  metadata?: {
    title?: string;
    description?: string;
    permalink?: string;
  };
}

interface LoadedContent {
  routesPaths?: string[];
  baseUrl?: string;
  outDir?: string;
  [key: string]: unknown;
}

const structuredDataPlugin = (context: LoadContext): Plugin<LoadedContent | null> => {
  const { siteConfig } = context;
  const { themeConfig } = siteConfig;
  const config = themeConfig as DocusaurusConfig;
  const { structuredData } = config;

  if (!structuredData) {
    throw new Error(
      'You need to specify the "structuredData" object in "themeConfig" to use docusaurus-plugin-structured-data'
    );
  }

  const breadcrumbLabelMap = structuredData.breadcrumbLabelMap || {};
  const baseUrl = siteConfig.url;
  const orgName = siteConfig.title;
  const verbose = true; // Force verbose for debugging
  const webpageDefaults = structuredData.webpage || {};
  const excludedRoutes = structuredData.excludedRoutes || [];

  console.log('Plugin initialized with config:', {
    baseUrl,
    orgName,
    webpageDefaults,
    excludedRoutes,
  });

  const orgData = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: orgName,
    url: baseUrl,
    ...(structuredData.organization || {}),
  };

  const webSiteData = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: orgName,
    url: baseUrl,
    description: siteConfig.tagline,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    ...(structuredData.website || {}),
  };

  function getBreadcrumbLabel(token: string): string {
    return breadcrumbLabelMap[token] || token;
  }

  function generateStructuredData(content: ContentItem) {
    const routePath = content.permalink;
    console.log('Generating structured data for:', { content, routePath });

    if (!routePath) {
      console.log('No routePath provided');
      return null;
    }

    if (excludedRoutes.some((pattern) =>
      new RegExp(pattern.replace('**', '.*')).test(routePath)
    )) {
      console.log(`route: ${routePath} is excluded`);
      return null;
    }

    const webPageUrl = `${baseUrl}${routePath}`;

    // Get title with fallbacks
    let webPageTitle = orgName;
    if (content.title) {
      webPageTitle = content.title;
    } else if (content.metadata?.title) {
      webPageTitle = content.metadata.title;
    }

    // Get description with fallbacks
    let webPageDescription = siteConfig.tagline;
    if (content.description) {
      webPageDescription = content.description;
    } else if (content.metadata?.description) {
      webPageDescription = content.metadata.description;
    }

    console.log('Page data:', { webPageTitle, webPageDescription, webPageUrl });

    // Create WebPage data according to schema.org/WebPage
    const webPageData = {
      '@type': 'WebPage',
      '@id': `${webPageUrl}#webpage`,
      url: webPageUrl,
      name: webPageTitle,
      description: webPageDescription,
      isPartOf: {
        '@id': `${baseUrl}#website`,
      },
      inLanguage: webpageDefaults.inLanguage || 'en-US',
      datePublished: webpageDefaults.datePublished || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      breadcrumb: {
        '@id': `${webPageUrl}#breadcrumb`,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      potentialAction: [
        {
          '@type': 'ReadAction',
          target: [webPageUrl],
        },
      ],
      ...webpageDefaults,
    };

    // Parse route path for breadcrumb
    const routeParts = routePath.split('/').filter(Boolean);
    console.log('Route parts:', routeParts);

    // Build breadcrumb list according to schema.org/BreadcrumbList
    const breadcrumbItems = [];
    let currentPath = '';

    // Always add home as first item
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': `${baseUrl}/#website`,
        name: 'Home',
      },
    });

    // Add intermediate paths
    routeParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const position = index + 2; // +2 because home is position 1
      const name = getBreadcrumbLabel(part);

      breadcrumbItems.push({
        '@type': 'ListItem',
        position: position,
        item: {
          '@id': `${baseUrl}${currentPath}`,
          name: name,
        },
      });
    });

    // Add current page as last item if not already included
    if (routeParts.length === 0 || webPageTitle !== getBreadcrumbLabel(routeParts[routeParts.length - 1])) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: breadcrumbItems.length + 1,
        item: {
          '@id': webPageUrl,
          name: webPageTitle,
        },
      });
    }

    const breadcrumbData = {
      '@type': 'BreadcrumbList',
      '@id': `${webPageUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    };

    console.log('Generated breadcrumb data:', breadcrumbData);

    return {
      '@context': 'https://schema.org',
      '@graph': [webPageData, breadcrumbData, webSiteData, orgData],
    };
  }

  return {
    name: 'docusaurus-plugin-structured-data',

    async loadContent(): Promise<LoadedContent> {
      console.log('Loading content');
      return {
        baseUrl: siteConfig.baseUrl,
      };
    },

    async contentLoaded({ content, actions }) {
      console.log('Content loaded with:', { content });
      const { createData } = actions;

      // Create the base structured data for the site
      const baseStructuredData = {
        '@context': 'https://schema.org',
        '@graph': [webSiteData, orgData],
      };

      await createData(
        'structured-data-base.json',
        JSON.stringify(baseStructuredData)
      );
    },

    configureWebpack(_config, isServer) {
      if (isServer) {
        console.log('Configuring webpack for server');
      }
      return {};
    },

    injectHtmlTags({ content, routePath }: { content: any; routePath?: string }) {
      // Force a fallback for the home doc
      const docSlug = content?.metadata?.slug;
      const isHomeSlug =
        docSlug === '/' ||
        docSlug === '' ||
        (!routePath && content?.metadata?.permalink === '/');

      const pageMetadata = {
        permalink:
          routePath ||
          content?.metadata?.permalink ||
          content?.permalink ||
          (isHomeSlug ? '/' : undefined),
        title:
          content?.metadata?.title ||
          content?.title ||
          (typeof content === 'object' && 'frontMatter' in content
            ? content.frontMatter.title
            : undefined),
        description:
          content?.metadata?.description ||
          content?.description ||
          (typeof content === 'object' && 'frontMatter' in content
            ? content.frontMatter.description
            : undefined),
        metadata: content?.metadata || content,
      } as ContentItem;

      console.log('Computed pageMetadata:', pageMetadata);

      console.log('Content object structure:', JSON.stringify(content, null, 2));
      console.log('Extracted page metadata:', pageMetadata);

      if (!pageMetadata.permalink) {
        console.log('No permalink found, using base data');
        return {
          headTags: [
            {
              tagName: 'script',
              attributes: {
                type: 'application/ld+json',
              },
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [webSiteData, orgData],
              }),
            },
          ],
        };
      }

      const structuredData = generateStructuredData(pageMetadata);

      if (!structuredData) {
        console.log('No structured data generated');
        return {
          headTags: [
            {
              tagName: 'script',
              attributes: {
                type: 'application/ld+json',
              },
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [webSiteData, orgData],
              }),
            },
          ],
        };
      }

      console.log('Generated full structured data');
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'application/ld+json',
            },
            innerHTML: JSON.stringify(structuredData),
          },
        ],
      };
    },
  };
};

export default structuredDataPlugin; 