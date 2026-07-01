# Middleman Configuration

###
# Site settings
###
set :site_url,       'https://ssenthilnathan3.github.io'
set :site_title,     'Senthilnathan'
set :site_description, 'i have some thoughts on technology, research, and ideas that i would like to put out.'
set :author_name,    'SENTHILNATHAN'

###
# Blog
###
activate :blog do |blog|
  blog.prefix         = 'blog'
  blog.permalink      = '{title}.html'
  blog.sources        = 'posts/:title.html'
  blog.layout         = 'blog_post'
  blog.default_extension = '.md'
  blog.tag_template   = nil
  blog.calendar_template = nil
  blog.paginate       = false
  blog.publish_future_dated = true
end

activate :directory_indexes

###
# Markdown
###
set :markdown_engine, :kramdown
set :markdown,
    input:                  'GFM',
    hard_wrap:              false,
    auto_ids:               true,
    syntax_highlighter:     :rouge,
    syntax_highlighter_opts: { css_class: 'highlight' }

###
# Layout
###
page '/*.xml',  layout: false
page '/*.json', layout: false
page '/*.txt',  layout: false

page '/',       layout: false   # index manages its own full html
page '/about/', layout: false   # about manages its own full html
page '/blog/',  layout: false   # blog index manages its own full html

###
# Directories
###
set :source,     'src'
set :css_dir,    'stylesheets'
set :js_dir,     'javascripts'
set :images_dir, 'images'

###
# Build
###
configure :build do
  activate :minify_html
  activate :asset_hash, ignore: ['favicon.svg']
end
