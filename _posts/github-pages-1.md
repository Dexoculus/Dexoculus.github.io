---
title: Github Pages - Environment configuration
tags: [GitHub, Web Development]
style: fill
color: danger
description: 1. Environment configuration
---

# **Introduction**

Github Pages provides one site per Github account or organization

# 1. Installing Ruby

To run Jekyll on Windows, you first need to install Ruby. The easiest way is using `winget` (Windows Package Manager).

```powershell
# Install Ruby 3.3 with DevKit
winget install RubyInstallerTeam.RubyWithDevKit.3.3 --accept-source-agreements --accept-package-agreements
```

# 2. Initializing MSYS2 (Ruby DevKit)

After installation, you need to initialize MSYS2, which provides the build tools required for some Ruby gems.

```powershell
# Run the ridk installation script (select 1 and 3)
ridk install 1 3
```

# 3. Installing Jekyll and Bundler

Once Ruby is set up, install the core gems for Jekyll development.

```powershell
gem install jekyll bundler
```

# 4. Local Development

Navigate to your project directory and install the specific dependencies listed in the `Gemfile`, then start the server.

```powershell
# Install project dependencies
bundle install

# Start the local Jekyll server
bundle exec jekyll serve
```

Your site will be available at `http://127.0.0.1:4000`.