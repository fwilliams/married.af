# Shim: Liquid 4.0.3 (pinned by github-pages) calls String#tainted?,
# which Ruby 4.0 removed. Restore as a no-op for local builds.
class String
  def tainted?; false; end
end
class Object
  def tainted?; false; end
end
