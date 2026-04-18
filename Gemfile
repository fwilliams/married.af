source "https://rubygems.org"

# Ruby 4.0 removed String#tainted? which Liquid 4.0.3 (pinned by github-pages)
# still references. Restore as a no-op for local builds. Skipped at GH Pages'
# own build (which runs their own environment).
require_relative "_plugins/liquid_ruby4_shim" if File.exist?(File.expand_path("_plugins/liquid_ruby4_shim.rb", __dir__))

# Use the github-pages gem so what we build locally matches what GitHub Pages deploys.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Ruby 3.4+ removed these from the default standard library; restore explicitly.
gem "csv"
gem "webrick"
gem "base64"
gem "bigdecimal"
gem "logger"
gem "fiddle"
gem "mutex_m"
gem "observer"
gem "ostruct"

# Windows/JRuby timezone data (no-ops on macOS)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
