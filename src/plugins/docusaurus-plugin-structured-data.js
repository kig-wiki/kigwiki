const path = require('path');

module.exports = function (context) {
    const {siteConfig} = context;
    const {themeConfig} = siteConfig;
    const {structuredData} = themeConfig || {};

    if (!structuredData) {
        throw new Error(
        `You need to specify the 'structuredData' object in 'themeConfig' to use docusaurus-plugin-structured-data`,
        );
    }

    // Initialize breadcrumbLabelMap if not provided
    structuredData.breadcrumbLabelMap = structuredData.breadcrumbLabelMap || {};

    const baseUrl = siteConfig.url;
    const orgName = siteConfig.title;
    const titleDelimiter = siteConfig.titleDelimiter;
    const verbose = structuredData.verbose || false;

    const orgData = {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: `${orgName}`,
        url: `${baseUrl}`,
        ...structuredData.organization,
    };

    const webSiteData = {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: `${orgName}`,
        url: `${baseUrl}`,
        description: `${siteConfig.tagline}`,
        publisher: {
            '@id': `${baseUrl}/#organization`,
        },
        ...structuredData.website,
    };

    const breadcrumbHomeData = {
        '@type': 'ListItem',
        position: 1,
        item: `${baseUrl}`,
        name: 'Home',
    };

    function getBreadcrumbLabel(token) {
        if (structuredData.breadcrumbLabelMap && structuredData.breadcrumbLabelMap.hasOwnProperty(token)) {
            return structuredData.breadcrumbLabelMap[token];
        } else {
            return token;
        }
    }

    function generateStructuredData(content = {}, routePath) {
        if (!routePath) {
            verbose && console.log('No routePath provided');
            return null;
        }

        if (structuredData.excludedRoutes && structuredData.excludedRoutes.some(pattern => 
            new RegExp(pattern.replace('**', '.*')).test(routePath))) {
            verbose && console.log(`route: ${routePath} is excluded`);
            return null;
        }

        const webPageUrl = `${baseUrl}${routePath}`;
        
        // Get title with fallbacks
        let webPageTitle = orgName;
        if (content?.title) {
            webPageTitle = content.title;
        } else if (content?.metadata?.title) {
            webPageTitle = content.metadata.title;
        }
        
        // Get description with fallbacks
        let webPageDescription = siteConfig.tagline;
        if (content?.description) {
            webPageDescription = content.description;
        } else if (content?.metadata?.description) {
            webPageDescription = content.metadata.description;
        }
        
        let webPageData = {
            '@type': 'WebPage',
            '@id': `${webPageUrl}#webpage`,
            url: webPageUrl,
            name: webPageTitle,
            description: webPageDescription,
            isPartOf: {
                '@id': `${baseUrl}#website`
            },
            inLanguage: structuredData.webpage?.inLanguage || 'en-US',
            datePublished: structuredData.webpage?.datePublished || new Date().toISOString(),
            dateModified: new Date().toISOString(),
            breadcrumb: {
                '@id': `${webPageUrl}#breadcrumb`
            },
            potentialAction: [{
                '@type': 'ReadAction',
                target: [webPageUrl]
            }],
            ...(structuredData.webpage || {}),
        };

        const routeArray = routePath.split('/')
            .filter(Boolean)
            .map(token => getBreadcrumbLabel(token));

        let breadcrumbData = {
            '@type': 'BreadcrumbList',
            '@id': `${webPageUrl}#breadcrumb`,
            itemListElement: [],
        };

        let elementIndex = 1;
        
        // Build breadcrumb based on route depth
        if (routeArray.length === 0) {
            if (webPageTitle !== 'Home') {
                breadcrumbData.itemListElement.push(breadcrumbHomeData);
                elementIndex = 2;
            }
        } else {
            breadcrumbData.itemListElement.push(breadcrumbHomeData);
            
            routeArray.forEach((element, index) => {
                if (index === routeArray.length - 1) return;
                
                breadcrumbData.itemListElement.push({
                    '@type': 'ListItem',
                    position: index + 2,
                    item: `${baseUrl}/${routeArray.slice(0, index + 1).join('/')}`,
                    name: getBreadcrumbLabel(element)
                });
            });
            
            elementIndex = routeArray.length + 1;
        }

        breadcrumbData.itemListElement.push({
            '@type': 'ListItem',
            position: elementIndex,
            name: webPageTitle,
        });

        return {
            '@context': 'https://schema.org',
            '@graph': [
                webPageData,
                breadcrumbData,
                webSiteData,
                orgData
            ]
        };
    }

    return {
        name: 'docusaurus-plugin-structured-data',
        
        injectHtmlTags({content, routePath}) {
            const structuredData = generateStructuredData(content, routePath);
            if (!structuredData) return {};
            
            return {
                headTags: [{
                    tagName: 'script',
                    attributes: {
                        type: 'application/ld+json',
                    },
                    innerHTML: JSON.stringify(structuredData),
                }],
            };
        },
    };
}; 