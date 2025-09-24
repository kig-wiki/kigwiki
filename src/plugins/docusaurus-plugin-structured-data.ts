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

interface LoadedContent {
  baseUrl?: string;
  outDir?: string;
  [key: string]: unknown;
}

const structuredDataPlugin = (context: LoadContext): Plugin<LoadedContent | null> => {
  const { siteConfig, siteDir } = context;
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
      // Check if we have valid page content or if this is just site initialization
      const hasPageMetadata = content && (
        content.metadata || 
        content.permalink || 
        content.title || 
        (typeof content === 'object' && 'frontMatter' in content)
      );

      // If we don't have page metadata, this might be site initialization
      // Return base structured data without page-specific information
      if (!hasPageMetadata) {
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
      };

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


      // For other pages, return basic structured data with breadcrumbs
      const webPageUrl = `${baseUrl}${pageMetadata.permalink}`;
      const routeParts = pageMetadata.permalink.split('/').filter(Boolean);
      
      const breadcrumbItems = [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@id': `${baseUrl}/#website`,
            name: 'Home',
          },
        },
      ];

      // Add intermediate paths
      let currentPath = '';
      routeParts.forEach((part: string, index: number) => {
        currentPath += `/${part}`;
        const position = index + 2;
        const name = part.charAt(0).toUpperCase() + part.slice(1);

        breadcrumbItems.push({
          '@type': 'ListItem',
          position: position,
          item: {
            '@id': `${baseUrl}${currentPath}`,
            name: name,
          },
        });
      });

      const basicStructuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${webPageUrl}#webpage`,
            url: webPageUrl,
            name: pageMetadata.title || orgName,
            description: pageMetadata.description || siteConfig.tagline,
            isPartOf: {
              '@id': `${baseUrl}#website`,
            },
            inLanguage: 'en-US',
            datePublished: '2024-01-01',
            dateModified: new Date().toISOString(),
            publisher: {
              '@id': `${baseUrl}/#organization`,
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${webPageUrl}#breadcrumb`,
            itemListElement: breadcrumbItems,
          },
          webSiteData,
          orgData,
        ],
      };

      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'application/ld+json',
            },
            innerHTML: JSON.stringify(basicStructuredData),
          },
        ],
      };
    },

  };
};

export default structuredDataPlugin;
