import type MarkdownIt from "markdown-it";
export type MarkdownItCompareOptions = {
    allowedKeys?: string[];
};
declare function markdownItCompare(md: MarkdownIt, _options?: MarkdownItCompareOptions): void;
export default markdownItCompare;
