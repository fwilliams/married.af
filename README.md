# married.af

Amanda Zhang & Francis Williams — Montréal, 2026.

Source for the wedding site hosted at `https://married.af`. Jekyll + GitHub Pages.

## Local development

**1. Install Ruby ≥ 3.2** (system Ruby on macOS is 2.6 which is too old).

The cleanest path:

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
ruby -v  # should say 3.x
```

Alternative: use `rbenv`, `asdf`, or the portable Ruby under Homebrew's vendor
directory at `/opt/homebrew/Library/Homebrew/vendor/portable-ruby/*/bin/`.

**2. Install gems and run:**

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve
# → http://127.0.0.1:4000
```

Edit any file and the site rebuilds; the browser reloads.

## How the site is organized

See the `Design language` section of the plan in `.cursor/plans/` for the full
token system. Short version:

- `_config.yml` — site-wide settings. The `wedding.*` block and `rsvp.*` block
  are the places most edits happen.
- `_sass/` — design tokens, base, components, layouts, motion, print. Split by
  concern. Assembled via `assets/css/style.scss`.
- `_layouts/default.html` — the page shell (masthead, main, footer).
- `_includes/` — componentised partials (masthead, footer, monogram SVG,
  seo-meta, coming-soon empty state, analytics).
- `_plugins/liquid_ruby4_shim.rb` — no-op shim for modern Ruby compatibility
  with the Liquid version pinned by `github-pages`.
- `index.md` — the landing page.
- `story.md`, `details.md`, `montreal.md`, `rsvp.md`, `gifts.md` — content
  pages. Each has `status:` front matter: `draft | teaser | live`. Non-live
  pages render as a styled "Coming soon" state.

## Phased rollout

Pages can ship without content. Front matter `status: draft | teaser | live`
controls whether the page renders its content or a coming-soon empty state.
Flip `status: live` when a page is ready.

## Editing content

Most edits only touch `_config.yml` (wedding date, tagline, contact email) and
the individual page Markdown files. No CSS work is needed for normal edits.

## Deployment

Push to `main`; GitHub Pages builds and serves from there. `CNAME` already
points the custom domain `married.af`.
