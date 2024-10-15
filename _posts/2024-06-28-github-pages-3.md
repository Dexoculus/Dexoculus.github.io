---
title: Github Pages - Customization
tags: [GitHub, Web Development]
style: fill
color: danger
comments: true
description: 3. Customization
---

# 1. Changing Blog Category first page.

I want to show tages first, not recent post.<br>
First, Modify root/pages/blog.html file

{% highlight html %}
    ---
    layout: default
    title: Blog
    weight: 2
    permalink: /blog/tags#
    ---
    {% raw %}
    {% include blog/search.html %}
    {% include blog/index.html %}
    {% endraw %}
{% endhighlight %}

I changed `permalink: /blog/` -> `permalink: /blog/tags#`.

# 2. Changing form of tags page

Modify root/_includes/blog/tags.html<br>

This is original tags.html
{% highlight html %}
    {% raw %}
    <!-- Collect tags from all posts -->
    {%- assign tags = blank -%}
    {%- for post in site.posts -%}
    {%- assign post_tags = post.tags | join:'|' | append:'|' -%}
    {%- if post_tags != '|' -%}
        {%- assign tags = tags | append:post_tags -%}
    {%- endif -%}
    {%- endfor -%}
    {%- assign tags = tags | split:'|' | uniq | sort -%}

    <!-- List tags & related posts -->
    {% for tag in tags %}
    <div class="py-3">
    <h4 id="{{ tag | slugify }}">{{ tag }}</h4>
    <ol>
    {% for post in site.posts %}
        {%- if post.tags contains tag -%}
        {%- if post.external_url -%}
            {%- assign url = post.external_url -%}
        {%- else -%}
            {%- assign url = post.url | relative_url -%}
        {%- endif -%}
        <a href="{{ url }}"><li>{{ post.title }}</li></a>
        <small class="text-muted"> - {{ post.date | date_to_long_string }}</small>
        <br/>
        {%- endif -%}
    {% endfor %}
    </ol>
    </div>
    <hr class="bg-light">
    {% endfor %}
    {% endraw %}
{% endhighlight %}


This is modified tags.html
{% highlight html %}
    {% raw %}
    <!-- Collect tags from all posts -->
    {%- assign tags = blank -%}
    {%- for post in site.posts -%}
    {%- assign post_tags = post.tags | join:'|' | append:'|' -%}
    {%- if post_tags != '|' -%}
        {%- assign tags = tags | append:post_tags -%}
    {%- endif -%}
    {%- endfor -%}
    {%- assign tags = tags | split:'|' | uniq | sort -%}

    <!-- List tags & related posts -->
    <div class="row">
    {% for tag in tags %}
    <div class="col-lg-6 my-3 wow animated fadeIn" data-wow-delay=".15s">
        <div class="card">
        <div class="card-body">
            <h3 class="card-title">{{ tag }}</h3>
            <ul class="list-unstyled">
            {% for post in site.posts %}
                {%- if post.tags contains tag -%}
                {%- if post.external_url -%}
                    {%- assign post_url = post.external_url -%}
                {%- else -%}
                    {%- assign post_url = post.url | relative_url -%}
                {%- endif -%}
                <li>
                    <a href="{{ post_url }}" {%- if post.external_url and site.open_new_tab -%} target="_blank" {%- endif -%}>
                    {{ post.title }}
                    </a>
                    <small class="text-muted"> - {{ post.date | date_to_long_string }}</small>
                </li>
                {%- endif -%}
            {% endfor %}
            </ul>
        </div>
        </div>
    </div>
    {% endfor %}
    </div>
    {% endraw %}
{% endhighlight %}

# 3. Adding MathJax plugin

For Adding MathJax plugin to github pages for supporting LaTeX, We need to add some scripts to root/_includes/head.html<br>
Add following tags to head.html code.

{% highlight html %}
    {% raw %}
    <!-- MathJax -->
    <script type="text/javascript" async
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js">
    </script>

    <!-- MathJax setting -->
    <script type="text/javascript">
        window.MathJax = {
        tex: {
            inlineMath: [['\\(','\\)'], ['$','$']],
            displayMath: [['$$','$$'], ['\\[','\\]']]
        },
        svg: {
            fontCache: 'global'
        }
        };
    </script>
    {% endraw %}
{% endhighlight %}

Now, you can include inline math like this: $ E = mc^2 $.

And you can include block math like this:<br>
$$
\displaystyle \int_0^\infty e^{-x} \, dx = 1
$$