# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-simple-texture"
  spec.version       = "0.7.0"
  spec.authors       = ["Yi Zeng"]
  spec.email         = ["developer@yizeng.me"]

  spec.summary       = %q{A gem-based responsive simple texture styled Jekyll theme.}
  spec.homepage      = "https://github.com/yizeng/jekyll-theme-simple-texture"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "github-pages", ">=209"
  spec.add_runtime_dependency "jekyll", ">= 3.9", "< 5.0"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.3"
  spec.add_runtime_dependency "jekyll-gist", "~> 1.4"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.1"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.4"

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake", "~> 13.0.1"
end
