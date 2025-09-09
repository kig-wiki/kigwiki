# Redirect Strategy for Kig.wiki

This document outlines the redirect strategy for maintaining SEO when changing page URLs on the Kig.wiki Docusaurus site deployed on Cloudflare Pages.

## Overview

We use a dual approach for handling redirects:

1. **Cloudflare Pages `_redirects` file** - For server-level redirects (301 status codes)
2. **Docusaurus `redirects` config** - For client-side redirects and additional flexibility

## Files Involved

- `/public/_redirects` - Cloudflare Pages redirect rules
- `docusaurus.config.ts` - Docusaurus redirect configuration

## Current Redirects

### Hadatai Page Migration
- **From:** `/hadatai` → **To:** `/hadatai/basics`
- **Reason:** Moved from general hadatai page to a more specific "basics" page
- **SEO Impact:** Preserves link equity and search rankings

## How to Add New Redirects

### 1. For Cloudflare Pages (Recommended for SEO)

Add to `/public/_redirects`:
```
/old-url /new-url 301
```

### 2. For Docusaurus Client-Side

Add to `docusaurus.config.ts` in the `redirects` array:
```typescript
{
  from: '/old-url',
  to: '/new-url',
}
```

## Best Practices

1. **Use 301 redirects** - These tell search engines the page has permanently moved
2. **Test redirects** - Verify they work after deployment
3. **Update internal links** - Change any internal references to use the new URLs
4. **Monitor analytics** - Watch for any traffic drops after URL changes
5. **Update sitemap** - Docusaurus will automatically update the sitemap.xml

## Common Redirect Patterns

### Simple Page Move
```
/old-page /new-page 301
```

### Section Restructure
```
/old-section/* /new-section/:splat 301
```

### Multiple Redirects
```
/old-page1 /new-page1 301
/old-page2 /new-page2 301
/old-page3 /new-page3 301
```

## Testing Redirects

1. **Local testing:** Use `npm run serve` to test locally
2. **Production testing:** Deploy to Cloudflare Pages and test the live URLs
3. **SEO tools:** Use tools like Screaming Frog or Google Search Console to verify redirects

## SEO Considerations

- **301 redirects preserve link equity** - Search engines transfer ranking power to the new URL
- **Update canonical URLs** - Ensure the new page has the correct canonical tag
- **Monitor search console** - Watch for crawl errors or indexing issues
- **Update external links** - Contact sites linking to old URLs when possible

## Troubleshooting

### Redirect Not Working
1. Check the `_redirects` file syntax
2. Verify the file is in the `/public/` directory
3. Ensure Cloudflare Pages is reading the file (check deployment logs)
4. Test with curl: `curl -I https://kig.wiki/old-url`

### Multiple Redirects
- Cloudflare Pages processes redirects in order
- Put more specific patterns before general ones
- Avoid redirect chains (A→B→C) when possible

## Example: Complete Migration Process

1. **Plan the change:**
   - Old URL: `/hadatai`
   - New URL: `/hadatai/basics`

2. **Add redirects:**
   - Add to `_redirects`: `/hadatai /hadatai/basics 301`
   - Add to `docusaurus.config.ts`: `{ from: '/hadatai', to: '/hadatai/basics' }`

3. **Update content:**
   - Change the slug in the markdown file frontmatter
   - Update any internal links

4. **Deploy and test:**
   - Deploy to Cloudflare Pages
   - Test both URLs work correctly
   - Verify 301 status code

5. **Monitor:**
   - Check Google Search Console for any issues
   - Monitor traffic in analytics
