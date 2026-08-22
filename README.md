# Kig.wiki

Welcome to the Github repo for [Kig.wiki](https://kig.wiki)

# What is Kigurumi?

Bishoujo Kigurumi, Kigurumi (着ぐるみ), or Kig/Kigu for even shorter is a mask oriented form of cosplay. Kigurumi typically combines both an anime styled mask with a type of zentai worn underneath, a Hadatai or Hada for short. Through strategic shapewear and padding wearers seek to transform themselves into their ideal of the represented character.

# What this aims to be

- A community resource that no one person owns, that is free as in freedom not free as in free beer. Libre, not gratis
- A site that provides those interested in Kigurumi with a spectrum of knowledge so they may best be equipped to make decisions

# What this is _not_ meant to be

- A community
- Any one individual's soapbox, the more contributors there are the further we can strive towards this
- An advertising spot for makers, merchants, etc
- A copy/paste of other kigurumi resources

# Why Kig.wiki exists

tldr: googling kigurumi mostly turns up stale "guides." Every maker that once was, prices and wait times from years ago, or third-hand grudges from people who have never even been happy with a mask they own. The point is enjoying the hobby and making getting a mask accessible, not drowning people in a sea of questionable links or outdated info.

The useful stuff lives in private Discords, group chats, and DMs, which means it is not on Google. Public kig servers fill up with people who have a lot of opinions and not much kig, fans who will never wear a mask, or someone who kigged once and wanted a hangout or soapbox. The performers you'd actually want to learn from tend not to live in that noise, if they show up at all. Kig.wiki exists to distill such kig wisdom, protips, and experiences onto the public web, along with meaningful maker resources so you can start without needing an invite, sitting in a questionable Discord, or sliding into someone's DMs.

Kigurumi is a bespoke hobby made by artisans both commercial and DIY, it is not a mass produced factory good, quality is not such a binary matter. Much like you would consider certain artists for certain art commissions based on their unique style, there is nuance to why you may want to go with one maker or the other as per the vision you have of your kigurumi. There rarely are perfect answers, only informed or uninformed decisions.

# How to contribute

## Content Contributors

This repository contains only the content for Kig.wiki. To contribute content:

- Write markdown files in [docs/](docs/)
- Add images to [static/img/](static/img/) (they will appear at `/img` on the live site)
- Add maker data in [makers/](makers/) (JSON files)
- Add hadatai data in [hadatai/](hadatai/) (JSON files)

[See contributing guidelines](https://kig.wiki/contributing/)

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

Feedback form ops (Turnstile site key at build time, `TURNSTILE_SECRET_KEY` + `DISCORD_WEBHOOK_URL` as Pages secrets) are documented in the [kigwiki-docusaurus README](https://github.com/kig-wiki/kigwiki-docusaurus).

Docusaurus is MIT licensed, as is any applicable content of the Kig.wiki site. Fork it or do as you please, like Kigurumi is for everyone so is this github's content.
