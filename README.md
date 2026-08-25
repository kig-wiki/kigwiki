# Kig.wiki

Welcome to the Github repo for [Kig.wiki](https://kig.wiki)

# What is Kigurumi?

Kigurumi (着ぐるみ), or Kig/Kigu for short is a mask oriented form of cosplay that bridges the gap between regular cosplay and more mascot-esque forms. Kigurumi typically combines both an anime styled mask wit a Hadatai bodysuit, along with strategic shapewear and padding to achieve the most "anime to life" transformation possible beyond typical cosplay.

# What this aims to be

- A site that makes it as easy as possible to get started with kigurumi, while also providing in depth guides and resoces for more nuanced areas of the hobby
- A community resource that no one person owns, that is free as in freedom not just free as in free beer. Libre, not just gratis

# What this is _not_ meant to be

- A community
- Any one individual's soapbox, the more contributors the better
- An advertising spot for makers, merchants, etc
- A copy/paste of other kigurumi resources, or some mere list of links with a few hot opinions

# Why Kig.wiki exists

tldr: googling for kigurumi resources mostly turns up scattered tutorials or stale "guides." Every maker that once was, prices and wait times from years ago, or third-hand vendettas from people who only buy fourth-rate masks and have a grudge against just about every decent maker. If they've never even been happy with a mask they own, they are probably not who you should be listening to. The point of a resource should be helping to enjoy the hobby and making getting a mask accessible, not drowning people in a sea of questionable links and outdated info.

The useful stuff lives in private Discords, group chats, and DMs, which means it is not on Google. Public kig servers fill up with people who have a lot of opinions and not much kig, fans who will never wear a mask, or someone who kigged once and wanted a hangout or soapbox. The performers you'd actually want to learn from tend not to live in that noise, if they show up at all. Kig.wiki exists to distill such kig wisdom, protips, and experiences onto the public web, along with meaningful maker resources so you can start without needing an invite, sitting in a questionable Discord, or sliding into someone's DMs.

# How to contribute

## Content Contributors

This repository contains only the content for Kig.wiki. To contribute content:

- Write markdown files in [docs/](docs/)
- If needed add images to [static/img/](static/img/) (they will appear at `/img` on the live site)
- Maker data exists in [makers/](makers/) (JSON files)
- Hadatai data exists in [hadatai/](hadatai/) (JSON files)

[See contributing guidelines](https://kig.wiki/contributing/) for finer details, we highly encourage contributions or critiques of the site or content. Is something not clear, poorly explained, or just wrong? Let us know!

## Technical Contributors

For infrastructure changes (Docusaurus config, Docker, CI/CD, etc.), see the [kigwiki-docusaurus](https://github.com/kig-wiki/kigwiki-docusaurus) repository.

# Working list of things to be done:

- [content to be added in markdown](docs/)
- new logo that isn't awful
- better tutorials

# Technical tldr:

This repository contains only the content for Kig.wiki. The technical infrastructure (Docusaurus configuration, Docker setup, CI/CD) is maintained in a separate repository: [kigwiki-docusaurus](https://github.com/kig-wiki/kigwiki-docusaurus).

## Repository Structure

- `docs/` - Markdown documentation files
- `makers/` - JSON data for kigurumi mask makers
- `hadatai/` - JSON data for hadatai (zentai) makers
- `static/` - Static assets (images, icons, etc.)
- `functions/` - Cloudflare Pages Functions (markdown content negotiation, `/api/feedback`)
- `kigwiki-docusaurus/` - Technical infrastructure (git submodule, most contributors need not worry about this)

Docusaurus is MIT licensed, as is any applicable content of the Kig.wiki site. Fork it or do as you please, like Kigurumi is for everyone so is this github's content.
