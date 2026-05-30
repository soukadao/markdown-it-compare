const assert = require("node:assert/strict");
const test = require("node:test");
const MarkdownIt = require("markdown-it");
const compare = require("../dist/index.js");

test("renders compare items", () => {
  const html = new MarkdownIt({ html: true }).use(compare).render(":::compare\n::item before Before\nA\n::\n::item after After\nB\n::\n:::");
  assert.match(html, /class="remark-compare remark-compare-2"/);
  assert.match(html, /data-compare-key="before"/);
  assert.match(html, /<p class="remark-compare-title">After<\/p>/);
  assert.doesNotMatch(html, /::/);
});

test("renders compare items with blank lines before markers", () => {
  const html = new MarkdownIt({ html: true }).use(compare).render(":::compare\n::item before Before\nA\n\n::\n::item after After\nB\n\n::\n:::");
  assert.match(html, /class="remark-compare remark-compare-2"/);
  assert.match(html, /<p class="remark-compare-title">Before<\/p>/);
  assert.doesNotMatch(html, /::/);
});
