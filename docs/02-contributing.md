---
sidebar_position: 3
title: Contributing
slug: /contributing
description: Kig.Wiki Contributing Guide - We'd love to have you contribute to Kig.Wiki
---

## Contributing Guidelines

A few things to note before contributing:

tldr: Be nice, be respectful, be helpful. Don't try to upload content you don't have permission to share with us, or content that goes against GitHub's terms of service.

On this wiki, we may use location labels for regional references, as importing and shipping options may differ especially for western buyers. These terms are used in a geographic sense only. 

## How to Contribute

Contributing to this documentation is _fairly_ straightforward if you have a GitHub account! Here's how you can help:

### GitHub Web UI

Technically you can do this all on the Github website.

1. Fork the [repository](https://github.com/kig-wiki/kigwiki)
2. Make your changes to the .MD markdown files in the docs folder throughGitHub's text editor
3. Submit a Pull Request from your fork to our `staging-build` branch

Since we're primarily dealing with Markdown files, the GitHub web interface is perfect for most contributions!
If this is not your thing, you can still contribute by [opening an issue](https://github.com/kig-wiki/kigwiki/issues)

### Traditional Git Method

For those who are more comfortable with Git, you can clone the repository and make your changes locally.
Repo has vscode settings if you want a better experience. 

### Document Structure

- All documentation pages go in the `docs/` directory
- Images should be placed in `static/img/` , they appear on the site in /img/
- To reference images in your markdown:

  ```markdown
  ![Image Description](/img/your-image.png)
  ```

- Docusaurus supports [MDX](https://mdxjs.com/) for more advanced content.
- The `slug` is the location of where the page will be

For example this will link to the contributing guide:

```markdown
[Contributing Guide](/contributing)
```

### Embedding Social Media Posts?

We have a custom component for embedding social media posts. It's a work in progress and will be improved in the future.
It can be used like this:
```<SocialEmbed post="https://twitter.com/user/status/1234567890" />```
```<SocialEmbed post="https://bsky.app/profile/username/post/1234567890"  />```
```<SocialEmbed post="https://www.tiktok.com/@username/video/1234567890"  />```
```<SocialEmbed post="https://www.youtube.com/watch?v=1234567890" />```

On a technical note, we do need to import a component on any pages its used, just after the frontmatter (the stuff at the top of the file that starts with `---`). ie

```
---
import SocialEmbed from '@site/src/components/SocialEmbed';
```



### Need Help?

If you're not familiar with Git or GitHub, don't worry! You can:

1. Open an issue describing the changes you'd like to make
2. Reach out to the maintainers for guidance
3. Share your content, and we can help get it added

While we can't guarantee all submissions will be published, we appreciate all contributions that align with our guidelines.

Want your own staging site? Raise an issue and we can probably get you one!

:::info
You can make info type blocks and other quality of life bits, checkout the [Docusaurus documentation](https://docusaurus.io/docs/creating-pages).

:::
