var pickBy = require('lodash.pickby')
var MD = require('markdown-it-coldmark')('coldmark')
var lazyHeaders = require('markdown-it-lazy-headers')
var emoji = require('markdown-it-emoji')
var expandTabs = require('markdown-it-expand-tabs')
var githubTaskList = require('markdown-it-task-lists')

var githubLinkify = require('./linkify')

var headingLinks = require('./plugin/heading-links')
var github = require('./plugin/github')
var htmlHeading = require('./plugin/html-heading')
var relaxedLinkRefs = require('./gfm/relaxed-link-reference')
var githubHeadings = require('./gfm/indented-headings')
var overrideLinkDestinationParser = require('./gfm/override-link-destination-parser')
var looseLinkParsing = require('./gfm/link')
var looseImageParsing = require('./gfm/image')
var relNoFollow = require('./plugin/nofollow')

var render = module.exports = function (markdown, options) {
  return render.getParser(options).render(markdown)
}

render.getParser = function (options) {
  var parser = MD
    .use(lazyHeaders)
    .use(emoji, {shortcuts: {}})
    .use(expandTabs, {tabWidth: 4})
    .use(githubTaskList)
    .use(githubHeadings)
    .use(relaxedLinkRefs)
    .use(github, {package: options.package})
    .use(htmlHeading)
    .use(overrideLinkDestinationParser)
    .use(looseLinkParsing)
    .use(looseImageParsing)

  if (options.headingLinks) {
    parser.use(headingLinks, options)
  }

  if (options.nofollow) {
    parser.use(relNoFollow)
  }

  return githubLinkify(parser)
}

render.renderPackageDescription = function (description) {
  return MD({html: true}).renderInline(description)
}
