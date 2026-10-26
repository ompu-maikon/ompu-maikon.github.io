---
layout: page
title: お知らせ
label: News
nav: news
permalink: /news/
lead: 活動報告など、マイコン部の最新情報です。
---

<div class="news-list">
{% for post in site.posts %}
<a class="news-item" href="{{ post.url | relative_url }}"><time>{{ post.date | date: "%Y.%m.%d" }}</time>{% if post.category %}<span class="tag">{{ post.category }}</span>{% endif %}<span class="news-title">{{ post.title }}</span><span class="arrow">→</span></a>
{% endfor %}
</div>
