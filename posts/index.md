---
layout: post
title: Home
---

# Welcome

This page is the home page of the website.

## Latest Release

{% for release in site.releases limit:1 %}

-   [{{ release.title }}]({{ release.url }})
    {% endfor %}

## Typescript Shenanigans

{% for post in site.tech limit:3 %}

-   [{{ post.title }}]({{ post.url }})
    {% endfor %}
