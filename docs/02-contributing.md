---
sidebar_position: 2
title: "How to Contribute to Kig.wiki"
sidebar_label: "Contributing to Kig.wiki"
slug: /contributing
canonical_url: https://kig.wiki/contributing
description: "Want to improve Kig.wiki? How to edit pages, submit changes, and what we look for in contributions to the kigurumi wiki."
toc_expanded_default: false
---

# Contributing to Kig.wiki

tldr: Be nice, be respectful, be helpful. Don't try to upload content you don't have permission to share with us, or content that goes against GitHub's terms of service.

## How to Contribute

Contributing to the site is _fairly_ straightforward if you have a GitHub account! Here's how you can help:

### GitHub Web UI

1. Fork the [repository](https://github.com/kig-wiki/kigwiki)
2. Edit the Markdown files in the `docs/` folder
3. Submit a pull request

The GitHub web editor works for most documentation changes. You alternatively can also [open an issue](https://github.com/kig-wiki/kigwiki/issues) with a correction or source if you'd rather just point out the problem.

### Traditional Git Method

For those who are more comfortable with Git you can also clone the repository and make changes locally then submit a PR. The repository includes VS Code settings for contributors to make it easier to edit the site.

### Document Structure

- All documentation pages go in the `docs/` directory
- Images belong in `static/img/` and appear on the site under `/img/`
- To reference images in your markdown:

  ```markdown
  ![Image Description](/img/your-image.png)
  ```

- Docusaurus supports [MDX](https://mdxjs.com/) for more advanced content.
- The `slug` defines the public page path

For example this will link to the contributing guide:

```markdown
[Contributing Guide](/contributing)
```

### Embedding Social Media Posts?

Use the custom social embed component like this:
`<SocialEmbed post="https://twitter.com/user/status/1234567890" />`
`<SocialEmbed post="https://x.com/user/status/1234567890" />`
`<SocialEmbed post="https://bsky.app/profile/username/post/1234567890"  />`
`<SocialEmbed post="https://www.tiktok.com/@username/video/1234567890"  />`
`<SocialEmbed post="https://www.youtube.com/watch?v=1234567890" />`
`<SocialEmbed post="https://www.instagram.com/p/SHORTCODE/" />`
`<SocialEmbed post="https://www.instagram.com/reel/SHORTCODE/" />`

Import the component after the frontmatter on every page that uses it:

```
---
import SocialEmbed from '@site/src/components/SocialEmbed';
```

Note: X/twitter posts marked as "sensitive media" aren't supported by their embed system, even if the content seems completely incorrectly labelled on their end. If this becomes a problem in the future a workaround might get added akin to the mask maker social embedding. Instagram embeds only work for public posts, reels, and IGTV videos.

### Need Help?

If you are not familiar with Git or GitHub, you can:

1. Open an issue describing the changes you'd like to make
2. Reach out to the maintainers for guidance
3. Share your content, and we can help get it added

While we can't guarantee all submissions will be published, we appreciate all contributions that align with our guidelines.

If you'd rather not use GitHub, [send feedback through the web form](/feedback/) or email `change-request@kig.wiki`.

:::info
For info blocks and other supported Markdown features, see the [Docusaurus documentation](https://docusaurus.io/docs/creating-pages).

:::
