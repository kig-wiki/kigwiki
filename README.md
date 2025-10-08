# Kig.wiki

Welcome to the Github repo for [Kig.wiki](https://kig.wiki)

# What is Kigurumi?

Bishoujo Kigurumi, Kigurumi (着ぐるみ), or Kig/Kigu for even shorter is a mask oriented form of cosplay. Kigurumi typically combines both an anime styled mask with a type of zentai worn underneath, a Hadatai or Hada for short. Through strategic shapewear and padding wearers seek to transform themselves into their ideal of the represented character.

# What this aims to be

- A community resource that no one person owns, that is free as in freedom not free as in free beer. Libre, not gratis
- A site that provides those interested in Kigurumi with a spectrum of knowledge so they may best be equiped to make decisions

# What this is _not_ meant to be

- A community
- Any one individual's soapbox, the more contributors there are the further we can strive towards this
- An advertising spot for makers, merchants, etc
- A copy/paste of other kigurumi resources

# Why Kig.wiki exists

tldr: inactivity and out of date info on various kigurumi resources, biases on many of said resources, or otherwise painting of various matters as black and white. Kigurumi is a bespoke hobby made by artesians both commercial and DIY, it is not a mass produced factory good, quality is not such a binary matter. Much like you would consider certain artists for certain art commisions based on their unique style, there is nuance to why you may want to go with one maker or the other as per the vision you have of your kigurumi. There rarely are perfect answers, only informed or uninformed decisions.

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
- new logo that isnt awful
- better tutorials

# Technical tldr:

This repository contains only the content for Kig.wiki. The technical infrastructure (Docusaurus configuration, Docker setup, CI/CD) is maintained in a separate repository: [kigwiki-docusaurus](https://github.com/kig-wiki/kigwiki-docusaurus).

## Repository Structure
- `docs/` - Markdown documentation files
- `makers/` - JSON data for kigurumi mask makers
- `hadatai/` - JSON data for hadatai (zentai) makers  
- `static/` - Static assets (images, icons, etc.)
- `kigwiki-docusaurus/` - Technical infrastructure (git submodule, most contributors need not worry about this)

Docusaurus is MIT licensed, as is any applicable content of the Kig.wiki site. Fork it or do as you please, like Kigurumi is for everyone so is this github's content.
