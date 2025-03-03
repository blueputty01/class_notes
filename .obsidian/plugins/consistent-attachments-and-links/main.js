'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const DEFAULT_SETTINGS = {
    moveAttachmentsWithNote: true,
    deleteAttachmentsWithNote: true,
    updateLinks: true,
    deleteEmptyFolders: true,
    deleteExistFilesWhenMoveNote: true,
    changeNoteBacklinksAlt: false,
    ignoreFolders: [".git/", ".obsidian/"],
    ignoreFiles: ["consistency\\-report\\.md"],
    ignoreFilesRegex: [/consistency\-report\.md/],
    attachmentsSubfolder: "",
    consistencyReportFile: "consistency-report.md",
    useBuiltInObsidianLinkCaching: false,
};
class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Consistent attachments and links - Settings' });
        new obsidian.Setting(containerEl)
            .setName('Move Attachments with Note')
            .setDesc('Automatically move attachments when a note is relocated. This includes attachments located in the same folder or any of its subfolders.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.moveAttachmentsWithNote = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.moveAttachmentsWithNote));
        new obsidian.Setting(containerEl)
            .setName('Delete Unused Attachments with Note')
            .setDesc('Automatically remove attachments that are no longer referenced in other notes when the note is deleted.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.deleteAttachmentsWithNote = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.deleteAttachmentsWithNote));
        new obsidian.Setting(containerEl)
            .setName('Update Links')
            .setDesc('Automatically update links to attachments and other notes when moving notes or attachments.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.updateLinks = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.updateLinks));
        new obsidian.Setting(containerEl)
            .setName('Delete Empty Folders')
            .setDesc('Automatically remove empty folders after moving notes with attachments.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.deleteEmptyFolders = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.deleteEmptyFolders));
        new obsidian.Setting(containerEl)
            .setName('Delete Duplicate Attachments on Note Move')
            .setDesc('Automatically delete attachments when moving a note if a file with the same name exists in the destination folder. If disabled, the file will be renamed and moved.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.deleteExistFilesWhenMoveNote = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.deleteExistFilesWhenMoveNote));
        new obsidian.Setting(containerEl)
            .setName('Update Backlink Text on Note Rename')
            .setDesc('When a note is renamed, its linked references are automatically updated. If this option is enabled, the text of backlinks to this note will also be modified.')
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.changeNoteBacklinksAlt = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.changeNoteBacklinksAlt));
        new obsidian.Setting(containerEl)
            .setName("Ignore Folders")
            .setDesc("Specify a list of folders to ignore. Enter each folder on a new line.")
            .addTextArea(cb => cb
            .setPlaceholder("Example: .git, .obsidian")
            .setValue(this.plugin.settings.ignoreFolders.join("\n"))
            .onChange((value) => {
            let paths = value.trim().split("\n").map(value => this.getNormalizedPath(value) + "/");
            this.plugin.settings.ignoreFolders = paths;
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName("Ignore Files")
            .setDesc("Specify a list of files to ignore. Enter each file on a new line.")
            .addTextArea(cb => cb
            .setPlaceholder("Example: consistant-report.md")
            .setValue(this.plugin.settings.ignoreFiles.join("\n"))
            .onChange((value) => {
            let paths = value.trim().split("\n");
            this.plugin.settings.ignoreFiles = paths;
            this.plugin.settings.ignoreFilesRegex = paths.map(file => RegExp(file));
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName("Attachment Subfolder")
            .setDesc("Specify the subfolder within the note folder to collect attachments into when using the \"Collect All Attachments\" hotkey. Leave empty to collect attachments directly into the note folder. You can use ${filename} as a placeholder for the current note name.")
            .addText(cb => cb
            .setPlaceholder("Example: _attachments")
            .setValue(this.plugin.settings.attachmentsSubfolder)
            .onChange((value) => {
            this.plugin.settings.attachmentsSubfolder = value;
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName("Consistency Report Filename")
            .setDesc("Specify the name of the file for the consistency report.")
            .addText(cb => cb
            .setPlaceholder("Example: consistency-report.md")
            .setValue(this.plugin.settings.consistencyReportFile)
            .onChange((value) => {
            this.plugin.settings.consistencyReportFile = value;
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName("EXPERIMENTAL: Use Built-in Obsidian Link Caching for Moved Notes")
            .setDesc("Enable this option to use the experimental built-in Obsidian link caching for processing moved notes. Turn it off if the plugin misbehaves.")
            .addToggle(cb => cb.onChange(value => {
            this.plugin.settings.useBuiltInObsidianLinkCaching = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.useBuiltInObsidianLinkCaching));
    }
    getNormalizedPath(path) {
        return path.length == 0 ? path : obsidian.normalizePath(path);
    }
}

class Utils {
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    static normalizePathForFile(path) {
        path = path.replace(/\\/gi, "/"); //replace \ to /
        path = path.replace(/%20/gi, " "); //replace %20 to space
        return path;
    }
    static normalizePathForLink(path) {
        path = path.replace(/\\/gi, "/"); //replace \ to /
        path = path.replace(/ /gi, "%20"); //replace space to %20
        return path;
    }
    static normalizeLinkSection(section) {
        section = decodeURI(section);
        return section;
    }
    static getCacheSafe(fileOrPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = Utils.getFile(fileOrPath);
            while (true) {
                const cache = app.metadataCache.getFileCache(file);
                if (cache) {
                    return cache;
                }
                yield Utils.delay(100);
            }
        });
    }
    static getFile(fileOrPath) {
        if (fileOrPath instanceof obsidian.TFile) {
            return fileOrPath;
        }
        const abstractFile = app.vault.getAbstractFileByPath(fileOrPath);
        if (!abstractFile) {
            throw `File ${fileOrPath} does not exist`;
        }
        if (!(abstractFile instanceof obsidian.TFile)) {
            throw `${fileOrPath} is not a file`;
        }
        return abstractFile;
    }
}

class path {
    static join(...parts) {
        if (arguments.length === 0)
            return '.';
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            if (arg.length > 0) {
                if (joined === undefined)
                    joined = arg;
                else
                    joined += '/' + arg;
            }
        }
        if (joined === undefined)
            return '.';
        return this.posixNormalize(joined);
    }
    static dirname(path) {
        if (path.length === 0)
            return '.';
        var code = path.charCodeAt(0);
        var hasRoot = code === 47 /*/*/;
        var end = -1;
        var matchedSlash = true;
        for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47 /*/*/) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? '/' : '.';
        if (hasRoot && end === 1)
            return '//';
        return path.slice(0, end);
    }
    static basename(path, ext) {
        if (ext !== undefined && typeof ext !== 'string')
            throw new TypeError('"ext" argument must be a string');
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return '';
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                var code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return '';
            return path.slice(start, end);
        }
    }
    static extname(path) {
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 || end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return '';
        }
        return path.slice(startDot, end);
    }
    static parse(path) {
        var ret = { root: '', dir: '', base: '', ext: '', name: '' };
        if (path.length === 0)
            return ret;
        var code = path.charCodeAt(0);
        var isAbsolute = code === 47 /*/*/;
        var start;
        if (isAbsolute) {
            ret.root = '/';
            start = 1;
        }
        else {
            start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Get non-dir info
        for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 || end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute)
                    ret.base = ret.name = path.slice(1, end);
                else
                    ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = '/';
        return ret;
    }
    static posixNormalize(path) {
        if (path.length === 0)
            return '.';
        var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;
        // Normalize the path
        path = this.normalizeStringPosix(path, !isAbsolute);
        if (path.length === 0 && !isAbsolute)
            path = '.';
        if (path.length > 0 && trailingSeparator)
            path += '/';
        if (isAbsolute)
            return '/' + path;
        return path;
    }
    static normalizeStringPosix(path, allowAboveRoot) {
        var res = '';
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
            if (i < path.length)
                code = path.charCodeAt(i);
            else if (code === 47 /*/*/)
                break;
            else
                code = 47 /*/*/;
            if (code === 47 /*/*/) {
                if (lastSlash === i - 1 || dots === 1) ;
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
                        if (res.length > 2) {
                            var lastSlashIndex = res.lastIndexOf('/');
                            if (lastSlashIndex !== res.length - 1) {
                                if (lastSlashIndex === -1) {
                                    res = '';
                                    lastSegmentLength = 0;
                                }
                                else {
                                    res = res.slice(0, lastSlashIndex);
                                    lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                                }
                                lastSlash = i;
                                dots = 0;
                                continue;
                            }
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = '';
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += '/..';
                        else
                            res = '..';
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += '/' + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === 46 /*.*/ && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    static posixResolve(...args) {
        var resolvedPath = '';
        var resolvedAbsolute = false;
        var cwd;
        for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
                path = args[i];
            else {
                if (cwd === undefined)
                    cwd = process.cwd();
                path = cwd;
            }
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = this.normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return '/' + resolvedPath;
            else
                return '/';
        }
        else if (resolvedPath.length > 0) {
            return resolvedPath;
        }
        else {
            return '.';
        }
    }
    static relative(from, to) {
        if (from === to)
            return '';
        from = this.posixResolve(from);
        to = this.posixResolve(to);
        if (from === to)
            return '';
        // Trim any leading backslashes
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47 /*/*/)
                break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47 /*/*/)
                break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /*/*/) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === 47 /*/*/)
                lastCommonSep = i;
        }
        var out = '';
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
                if (out.length === 0)
                    out += '..';
                else
                    out += '/..';
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47 /*/*/)
                ++toStart;
            return to.slice(toStart);
        }
    }
}

//simple regex
// const markdownLinkOrEmbedRegexSimple = /\[(.*?)\]\((.*?)\)/gim
// const markdownLinkRegexSimple = /(?<!\!)\[(.*?)\]\((.*?)\)/gim;
// const markdownEmbedRegexSimple = /\!\[(.*?)\]\((.*?)\)/gim
// const wikiLinkOrEmbedRegexSimple = /\[\[(.*?)\]\]/gim
// const wikiLinkRegexSimple = /(?<!\!)\[\[(.*?)\]\]/gim;
// const wikiEmbedRegexSimple = /\!\[\[(.*?)\]\]/gim
//with escaping \ characters
const markdownLinkOrEmbedRegexG = /(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/gim;
const markdownLinkRegexG = /(?<!\!)(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)(?:#(.*?))?\)/gim;
const markdownEmbedRegexG = /(?<!\\)\!\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/gim;
const wikiLinkOrEmbedRegexG = /(?<!\\)\[\[(.*?)(?<!\\)\]\]/gim;
const wikiLinkRegexG = /(?<!\!)(?<!\\)\[\[(.*?)(?<!\\)\]\]/gim;
const wikiEmbedRegexG = /(?<!\\)\!\[\[(.*?)(?<!\\)\]\]/gim;
const markdownLinkOrEmbedRegex = /(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/im;
const markdownLinkRegex = /(?<!\!)(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/im;
class LinksHandler {
    constructor(app, consoleLogPrefix = "", ignoreFolders = [], ignoreFilesRegex = []) {
        this.app = app;
        this.consoleLogPrefix = consoleLogPrefix;
        this.ignoreFolders = ignoreFolders;
        this.ignoreFilesRegex = ignoreFilesRegex;
    }
    isPathIgnored(path) {
        if (path.startsWith("./"))
            path = path.substring(2);
        for (let folder of this.ignoreFolders) {
            if (path.startsWith(folder)) {
                return true;
            }
        }
        for (let fileRegex of this.ignoreFilesRegex) {
            if (fileRegex.test(path)) {
                return true;
            }
        }
    }
    checkIsCorrectMarkdownEmbed(text) {
        let elements = text.match(markdownEmbedRegexG);
        return (elements != null && elements.length > 0);
    }
    checkIsCorrectMarkdownLink(text) {
        let elements = text.match(markdownLinkRegexG);
        return (elements != null && elements.length > 0);
    }
    checkIsCorrectMarkdownEmbedOrLink(text) {
        let elements = text.match(markdownLinkOrEmbedRegexG);
        return (elements != null && elements.length > 0);
    }
    checkIsCorrectWikiEmbed(text) {
        let elements = text.match(wikiEmbedRegexG);
        return (elements != null && elements.length > 0);
    }
    checkIsCorrectWikiLink(text) {
        let elements = text.match(wikiLinkRegexG);
        return (elements != null && elements.length > 0);
    }
    checkIsCorrectWikiEmbedOrLink(text) {
        let elements = text.match(wikiLinkOrEmbedRegexG);
        return (elements != null && elements.length > 0);
    }
    getFileByLink(link, owningNotePath, allowInvalidLink = true) {
        link = this.splitLinkToPathAndSection(link).link;
        if (allowInvalidLink) {
            return this.app.metadataCache.getFirstLinkpathDest(link, owningNotePath);
        }
        let fullPath = this.getFullPathForLink(link, owningNotePath);
        return this.getFileByPath(fullPath);
    }
    getFileByPath(path) {
        path = Utils.normalizePathForFile(path);
        return app.vault.getAbstractFileByPath(path);
    }
    getFullPathForLink(link, owningNotePath) {
        link = this.splitLinkToPathAndSection(link).link;
        link = Utils.normalizePathForFile(link);
        owningNotePath = Utils.normalizePathForFile(owningNotePath);
        let parentFolder = owningNotePath.substring(0, owningNotePath.lastIndexOf("/"));
        let fullPath = path.join(parentFolder, link);
        fullPath = Utils.normalizePathForFile(fullPath);
        return fullPath;
    }
    getAllCachedLinksToFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let allLinks = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (note.path == filePath)
                        continue;
                    let links = (yield Utils.getCacheSafe(note.path)).links;
                    if (links) {
                        for (let link of links) {
                            let linkFullPath = this.getFullPathForLink(link.link, note.path);
                            if (linkFullPath == filePath) {
                                if (!allLinks[note.path])
                                    allLinks[note.path] = [];
                                allLinks[note.path].push(link);
                            }
                        }
                    }
                }
            }
            return allLinks;
        });
    }
    getAllCachedEmbedsToFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let allEmbeds = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (note.path == filePath)
                        continue;
                    //!!! this can return undefined if note was just updated
                    let embeds = (yield Utils.getCacheSafe(note.path)).embeds;
                    if (embeds) {
                        for (let embed of embeds) {
                            let linkFullPath = this.getFullPathForLink(embed.link, note.path);
                            if (linkFullPath == filePath) {
                                if (!allEmbeds[note.path])
                                    allEmbeds[note.path] = [];
                                allEmbeds[note.path].push(embed);
                            }
                        }
                    }
                }
            }
            return allEmbeds;
        });
    }
    getAllBadLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let allLinks = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let links = (yield Utils.getCacheSafe(note.path)).links;
                    if (links) {
                        for (let link of links) {
                            if (link.link.startsWith("#")) //internal section link
                                continue;
                            if (this.checkIsCorrectWikiLink(link.original))
                                continue;
                            let file = this.getFileByLink(link.link, note.path, false);
                            if (!file) {
                                if (!allLinks[note.path])
                                    allLinks[note.path] = [];
                                allLinks[note.path].push(link);
                            }
                        }
                    }
                }
            }
            return allLinks;
        });
    }
    getAllBadEmbeds() {
        return __awaiter(this, void 0, void 0, function* () {
            let allEmbeds = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let embeds = (yield Utils.getCacheSafe(note.path)).embeds;
                    if (embeds) {
                        for (let embed of embeds) {
                            if (this.checkIsCorrectWikiEmbed(embed.original))
                                continue;
                            let file = this.getFileByLink(embed.link, note.path, false);
                            if (!file) {
                                if (!allEmbeds[note.path])
                                    allEmbeds[note.path] = [];
                                allEmbeds[note.path].push(embed);
                            }
                        }
                    }
                }
            }
            return allEmbeds;
        });
    }
    getAllGoodLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let allLinks = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let links = (yield Utils.getCacheSafe(note.path)).links;
                    if (links) {
                        for (let link of links) {
                            if (link.link.startsWith("#")) //internal section link
                                continue;
                            if (this.checkIsCorrectWikiLink(link.original))
                                continue;
                            let file = this.getFileByLink(link.link, note.path);
                            if (file) {
                                if (!allLinks[note.path])
                                    allLinks[note.path] = [];
                                allLinks[note.path].push(link);
                            }
                        }
                    }
                }
            }
            return allLinks;
        });
    }
    getAllBadSectionLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let allLinks = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let links = (yield Utils.getCacheSafe(note.path)).links;
                    if (links) {
                        for (let link of links) {
                            if (this.checkIsCorrectWikiLink(link.original))
                                continue;
                            let li = this.splitLinkToPathAndSection(link.link);
                            if (!li.hasSection)
                                continue;
                            let file = this.getFileByLink(link.link, note.path, false);
                            if (file) {
                                if (file.extension === "pdf" && li.section.startsWith("page=")) {
                                    continue;
                                }
                                let text = yield this.app.vault.read(file);
                                let section = Utils.normalizeLinkSection(li.section);
                                if (section.startsWith("^")) //skip ^ links
                                    continue;
                                let regex = /[ !@$%^&*()-=_+\\/;'\[\]\"\|\?.\,\<\>\`\~\{\}]/gim;
                                text = text.replace(regex, '');
                                section = section.replace(regex, '');
                                if (!text.contains("#" + section)) {
                                    if (!allLinks[note.path])
                                        allLinks[note.path] = [];
                                    allLinks[note.path].push(link);
                                }
                            }
                        }
                    }
                }
            }
            return allLinks;
        });
    }
    getAllGoodEmbeds() {
        return __awaiter(this, void 0, void 0, function* () {
            let allEmbeds = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let embeds = (yield Utils.getCacheSafe(note.path)).embeds;
                    if (embeds) {
                        for (let embed of embeds) {
                            if (this.checkIsCorrectWikiEmbed(embed.original))
                                continue;
                            let file = this.getFileByLink(embed.link, note.path);
                            if (file) {
                                if (!allEmbeds[note.path])
                                    allEmbeds[note.path] = [];
                                allEmbeds[note.path].push(embed);
                            }
                        }
                    }
                }
            }
            return allEmbeds;
        });
    }
    getAllWikiLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let allLinks = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let links = (yield Utils.getCacheSafe(note.path)).links;
                    if (links) {
                        for (let link of links) {
                            if (!this.checkIsCorrectWikiLink(link.original))
                                continue;
                            if (!allLinks[note.path])
                                allLinks[note.path] = [];
                            allLinks[note.path].push(link);
                        }
                    }
                }
            }
            return allLinks;
        });
    }
    getAllWikiEmbeds() {
        return __awaiter(this, void 0, void 0, function* () {
            let allEmbeds = {};
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    //!!! this can return undefined if note was just updated
                    let embeds = (yield Utils.getCacheSafe(note.path)).embeds;
                    if (embeds) {
                        for (let embed of embeds) {
                            if (!this.checkIsCorrectWikiEmbed(embed.original))
                                continue;
                            if (!allEmbeds[note.path])
                                allEmbeds[note.path] = [];
                            allEmbeds[note.path].push(embed);
                        }
                    }
                }
            }
            return allEmbeds;
        });
    }
    updateLinksToRenamedFile(oldNotePath, newNotePath, changelinksAlt = false, useBuiltInObsidianLinkCaching = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(oldNotePath) || this.isPathIgnored(newNotePath))
                return;
            let notes = useBuiltInObsidianLinkCaching ? yield this.getCachedNotesThatHaveLinkToFile(oldNotePath) : yield this.getNotesThatHaveLinkToFile(oldNotePath);
            let links = [{ oldPath: oldNotePath, newPath: newNotePath }];
            if (notes) {
                for (let note of notes) {
                    yield this.updateChangedPathsInNote(note, links, changelinksAlt);
                }
            }
        });
    }
    updateChangedPathInNote(notePath, oldLink, newLink, changelinksAlt = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let changes = [{ oldPath: oldLink, newPath: newLink }];
            return yield this.updateChangedPathsInNote(notePath, changes, changelinksAlt);
        });
    }
    updateChangedPathsInNote(notePath, changedLinks, changelinksAlt = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let file = this.getFileByPath(notePath);
            if (!file) {
                console.error(this.consoleLogPrefix + "cant update links in note, file not found: " + notePath);
                return;
            }
            let text = yield this.app.vault.read(file);
            let dirty = false;
            let elements = text.match(markdownLinkOrEmbedRegexG);
            if (elements != null && elements.length > 0) {
                for (let el of elements) {
                    let alt = el.match(markdownLinkOrEmbedRegex)[1];
                    let link = el.match(markdownLinkOrEmbedRegex)[2];
                    let li = this.splitLinkToPathAndSection(link);
                    if (li.hasSection) // for links with sections like [](note.md#section)
                        link = li.link;
                    let fullLink = this.getFullPathForLink(link, notePath);
                    for (let changedLink of changedLinks) {
                        if (fullLink == changedLink.oldPath) {
                            let newRelLink = path.relative(notePath, changedLink.newPath);
                            newRelLink = Utils.normalizePathForLink(newRelLink);
                            if (newRelLink.startsWith("../")) {
                                newRelLink = newRelLink.substring(3);
                            }
                            if (changelinksAlt && newRelLink.endsWith(".md")) {
                                //rename only if old alt == old note name
                                if (alt === path.basename(changedLink.oldPath, path.extname(changedLink.oldPath))) {
                                    let ext = path.extname(newRelLink);
                                    let baseName = path.basename(newRelLink, ext);
                                    alt = Utils.normalizePathForFile(baseName);
                                }
                            }
                            if (li.hasSection)
                                text = text.replace(el, '[' + alt + ']' + '(' + newRelLink + '#' + li.section + ')');
                            else
                                text = text.replace(el, '[' + alt + ']' + '(' + newRelLink + ')');
                            dirty = true;
                            console.log(this.consoleLogPrefix + "link updated in cached note [note, old link, new link]: \n   "
                                + file.path + "\n   " + link + "\n   " + newRelLink);
                        }
                    }
                }
            }
            if (dirty)
                yield this.app.vault.modify(file, text);
        });
    }
    updateInternalLinksInMovedNote(oldNotePath, newNotePath, attachmentsAlreadyMoved) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(oldNotePath) || this.isPathIgnored(newNotePath))
                return;
            let file = this.getFileByPath(newNotePath);
            if (!file) {
                console.error(this.consoleLogPrefix + "can't update internal links, file not found: " + newNotePath);
                return;
            }
            let text = yield this.app.vault.read(file);
            let dirty = false;
            let elements = text.match(markdownLinkOrEmbedRegexG);
            if (elements != null && elements.length > 0) {
                for (let el of elements) {
                    let alt = el.match(markdownLinkOrEmbedRegex)[1];
                    let link = el.match(markdownLinkOrEmbedRegex)[2];
                    let li = this.splitLinkToPathAndSection(link);
                    if (link.startsWith("#")) //internal section link
                        continue;
                    if (li.hasSection) // for links with sections like [](note.md#section)
                        link = li.link;
                    //startsWith("../") - for not skipping files that not in the note dir
                    if (attachmentsAlreadyMoved && !link.endsWith(".md") && !link.startsWith("../"))
                        continue;
                    let file = this.getFileByLink(link, oldNotePath);
                    if (!file) {
                        file = this.getFileByLink(link, newNotePath);
                        if (!file) {
                            console.error(this.consoleLogPrefix + newNotePath + " has bad link (file does not exist): " + link);
                            continue;
                        }
                    }
                    let newRelLink = path.relative(newNotePath, file.path);
                    newRelLink = Utils.normalizePathForLink(newRelLink);
                    if (newRelLink.startsWith("../")) {
                        newRelLink = newRelLink.substring(3);
                    }
                    if (li.hasSection)
                        text = text.replace(el, '[' + alt + ']' + '(' + newRelLink + '#' + li.section + ')');
                    else
                        text = text.replace(el, '[' + alt + ']' + '(' + newRelLink + ')');
                    dirty = true;
                    console.log(this.consoleLogPrefix + "link updated in moved note [note, old link, new link]: \n   "
                        + file.path + "\n   " + link + "   \n" + newRelLink);
                }
            }
            if (dirty)
                yield this.app.vault.modify(file, text);
        });
    }
    getCachedNotesThatHaveLinkToFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let notes = [];
            let allNotes = this.app.vault.getMarkdownFiles();
            if (allNotes) {
                for (let note of allNotes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let notePath = note.path;
                    if (note.path == filePath)
                        continue;
                    //!!! this can return undefined if note was just updated
                    let embeds = (yield Utils.getCacheSafe(notePath)).embeds;
                    if (embeds) {
                        for (let embed of embeds) {
                            let linkPath = this.getFullPathForLink(embed.link, note.path);
                            if (linkPath == filePath) {
                                if (!notes.contains(notePath))
                                    notes.push(notePath);
                            }
                        }
                    }
                    //!!! this can return undefined if note was just updated
                    let links = (yield Utils.getCacheSafe(notePath)).links;
                    if (links) {
                        for (let link of links) {
                            let linkPath = this.getFullPathForLink(link.link, note.path);
                            if (linkPath == filePath) {
                                if (!notes.contains(notePath))
                                    notes.push(notePath);
                            }
                        }
                    }
                }
            }
            return notes;
        });
    }
    getNotesThatHaveLinkToFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let notes = [];
            let allNotes = this.app.vault.getMarkdownFiles();
            if (allNotes) {
                for (let note of allNotes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let notePath = note.path;
                    if (notePath == filePath)
                        continue;
                    let links = yield this.getLinksFromNote(notePath);
                    for (let link of links) {
                        let li = this.splitLinkToPathAndSection(link.link);
                        let linkFullPath = this.getFullPathForLink(li.link, notePath);
                        if (linkFullPath == filePath) {
                            if (!notes.contains(notePath))
                                notes.push(notePath);
                        }
                    }
                }
            }
            return notes;
        });
    }
    splitLinkToPathAndSection(link) {
        let res = {
            hasSection: false,
            link: link,
            section: ""
        };
        if (!link.contains('#'))
            return res;
        let linkBeforeHash = link.match(/(.*?)#(.*?)$/)[1];
        let section = link.match(/(.*?)#(.*?)$/)[2];
        let isMarkdownSection = section != "" && linkBeforeHash.endsWith(".md"); // for links with sections like [](note.md#section)
        let isPdfPageSection = section.startsWith("page=") && linkBeforeHash.endsWith(".pdf"); // for links with sections like [](note.pdf#page=42)
        if (isMarkdownSection || isPdfPageSection) {
            res = {
                hasSection: true,
                link: linkBeforeHash,
                section: section
            };
        }
        return res;
    }
    getFilePathWithRenamedBaseName(filePath, newBaseName) {
        return Utils.normalizePathForFile(path.join(path.dirname(filePath), newBaseName + path.extname(filePath)));
    }
    getLinksFromNote(notePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = this.getFileByPath(notePath);
            if (!file) {
                console.error(this.consoleLogPrefix + "can't get embeds, file not found: " + notePath);
                return;
            }
            let text = yield this.app.vault.read(file);
            let links = [];
            let elements = text.match(markdownLinkOrEmbedRegexG);
            if (elements != null && elements.length > 0) {
                for (let el of elements) {
                    let alt = el.match(markdownLinkOrEmbedRegex)[1];
                    let link = el.match(markdownLinkOrEmbedRegex)[2];
                    let emb = {
                        link: link,
                        displayText: alt,
                        original: el,
                        position: {
                            start: {
                                col: 0,
                                line: 0,
                                offset: 0
                            },
                            end: {
                                col: 0,
                                line: 0,
                                offset: 0
                            }
                        }
                    };
                    links.push(emb);
                }
            }
            return links;
        });
    }
    convertAllNoteEmbedsPathsToRelative(notePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let changedEmbeds = [];
            let embeds = (yield Utils.getCacheSafe(notePath)).embeds;
            if (embeds) {
                for (let embed of embeds) {
                    let isMarkdownEmbed = this.checkIsCorrectMarkdownEmbed(embed.original);
                    let isWikiEmbed = this.checkIsCorrectWikiEmbed(embed.original);
                    if (isMarkdownEmbed || isWikiEmbed) {
                        let file = this.getFileByLink(embed.link, notePath);
                        if (file)
                            continue;
                        file = this.app.metadataCache.getFirstLinkpathDest(embed.link, notePath);
                        if (file) {
                            let newRelLink = path.relative(notePath, file.path);
                            newRelLink = isMarkdownEmbed ? Utils.normalizePathForLink(newRelLink) : Utils.normalizePathForFile(newRelLink);
                            if (newRelLink.startsWith("../")) {
                                newRelLink = newRelLink.substring(3);
                            }
                            changedEmbeds.push({ old: embed, newLink: newRelLink });
                        }
                        else {
                            console.error(this.consoleLogPrefix + notePath + " has bad embed (file does not exist): " + embed.link);
                        }
                    }
                    else {
                        console.error(this.consoleLogPrefix + notePath + " has bad embed (format of link is not markdown or wiki link): " + embed.original);
                    }
                }
            }
            yield this.updateChangedEmbedInNote(notePath, changedEmbeds);
            return changedEmbeds;
        });
    }
    convertAllNoteLinksPathsToRelative(notePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let changedLinks = [];
            let links = (yield Utils.getCacheSafe(notePath)).links;
            if (links) {
                for (let link of links) {
                    let isMarkdownLink = this.checkIsCorrectMarkdownLink(link.original);
                    let isWikiLink = this.checkIsCorrectWikiLink(link.original);
                    if (isMarkdownLink || isWikiLink) {
                        if (link.link.startsWith("#")) //internal section link
                            continue;
                        let file = this.getFileByLink(link.link, notePath);
                        if (file)
                            continue;
                        //!!! link.displayText is always "" - OBSIDIAN BUG?, so get display text manualy
                        if (isMarkdownLink) {
                            let elements = link.original.match(markdownLinkRegex);
                            if (elements)
                                link.displayText = elements[1];
                        }
                        file = this.app.metadataCache.getFirstLinkpathDest(link.link, notePath);
                        if (file) {
                            let newRelLink = path.relative(notePath, file.path);
                            newRelLink = isMarkdownLink ? Utils.normalizePathForLink(newRelLink) : Utils.normalizePathForFile(newRelLink);
                            if (newRelLink.startsWith("../")) {
                                newRelLink = newRelLink.substring(3);
                            }
                            changedLinks.push({ old: link, newLink: newRelLink });
                        }
                        else {
                            console.error(this.consoleLogPrefix + notePath + " has bad link (file does not exist): " + link.link);
                        }
                    }
                    else {
                        console.error(this.consoleLogPrefix + notePath + " has bad link (format of link is not markdown or wiki link): " + link.original);
                    }
                }
            }
            yield this.updateChangedLinkInNote(notePath, changedLinks);
            return changedLinks;
        });
    }
    updateChangedEmbedInNote(notePath, changedEmbeds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let noteFile = this.getFileByPath(notePath);
            if (!noteFile) {
                console.error(this.consoleLogPrefix + "can't update embeds in note, file not found: " + notePath);
                return;
            }
            let text = yield this.app.vault.read(noteFile);
            let dirty = false;
            if (changedEmbeds && changedEmbeds.length > 0) {
                for (let embed of changedEmbeds) {
                    if (embed.old.link == embed.newLink)
                        continue;
                    if (this.checkIsCorrectMarkdownEmbed(embed.old.original)) {
                        text = text.replace(embed.old.original, '![' + embed.old.displayText + ']' + '(' + embed.newLink + ')');
                    }
                    else if (this.checkIsCorrectWikiEmbed(embed.old.original)) {
                        text = text.replace(embed.old.original, '![[' + embed.newLink + ']]');
                    }
                    else {
                        console.error(this.consoleLogPrefix + notePath + " has bad embed (format of link is not maekdown or wiki link): " + embed.old.original);
                        continue;
                    }
                    console.log(this.consoleLogPrefix + "embed updated in note [note, old link, new link]: \n   "
                        + noteFile.path + "\n   " + embed.old.link + "\n   " + embed.newLink);
                    dirty = true;
                }
            }
            if (dirty)
                yield this.app.vault.modify(noteFile, text);
        });
    }
    updateChangedLinkInNote(notePath, chandedLinks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let noteFile = this.getFileByPath(notePath);
            if (!noteFile) {
                console.error(this.consoleLogPrefix + "can't update links in note, file not found: " + notePath);
                return;
            }
            let text = yield this.app.vault.read(noteFile);
            let dirty = false;
            if (chandedLinks && chandedLinks.length > 0) {
                for (let link of chandedLinks) {
                    if (link.old.link == link.newLink)
                        continue;
                    if (this.checkIsCorrectMarkdownLink(link.old.original)) {
                        text = text.replace(link.old.original, '[' + link.old.displayText + ']' + '(' + link.newLink + ')');
                    }
                    else if (this.checkIsCorrectWikiLink(link.old.original)) {
                        text = text.replace(link.old.original, '[[' + link.newLink + ']]');
                    }
                    else {
                        console.error(this.consoleLogPrefix + notePath + " has bad link (format of link is not maekdown or wiki link): " + link.old.original);
                        continue;
                    }
                    console.log(this.consoleLogPrefix + "cached link updated in note [note, old link, new link]: \n   "
                        + noteFile.path + "\n   " + link.old.link + "\n   " + link.newLink);
                    dirty = true;
                }
            }
            if (dirty)
                yield this.app.vault.modify(noteFile, text);
        });
    }
    replaceAllNoteWikilinksWithMarkdownLinks(notePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let res = {
                links: [],
                embeds: [],
            };
            let noteFile = this.getFileByPath(notePath);
            if (!noteFile) {
                console.error(this.consoleLogPrefix + "can't update wikilinks in note, file not found: " + notePath);
                return;
            }
            const cache = yield Utils.getCacheSafe(notePath);
            let links = cache.links;
            let embeds = cache.embeds;
            let text = yield this.app.vault.read(noteFile);
            let dirty = false;
            if (embeds) { //embeds must go first!
                for (let embed of embeds) {
                    if (this.checkIsCorrectWikiEmbed(embed.original)) {
                        let newPath = Utils.normalizePathForLink(embed.link);
                        let newLink = '![' + ']' + '(' + newPath + ')';
                        text = text.replace(embed.original, newLink);
                        console.log(this.consoleLogPrefix + "wiki link (embed) replaced in note [note, old link, new link]: \n   "
                            + noteFile.path + "\n   " + embed.original + "\n   " + newLink);
                        res.embeds.push({ old: embed, newLink: newLink });
                        dirty = true;
                    }
                }
            }
            if (links) {
                for (let link of links) {
                    if (this.checkIsCorrectWikiLink(link.original)) {
                        let newPath = Utils.normalizePathForLink(link.link);
                        let file = this.app.metadataCache.getFirstLinkpathDest(link.link, notePath);
                        if (file && file.extension == "md" && !newPath.endsWith(".md"))
                            newPath = newPath + ".md";
                        let newLink = '[' + link.displayText + ']' + '(' + newPath + ')';
                        text = text.replace(link.original, newLink);
                        console.log(this.consoleLogPrefix + "wiki link replaced in note [note, old link, new link]: \n   "
                            + noteFile.path + "\n   " + link.original + "\n   " + newLink);
                        res.links.push({ old: link, newLink: newLink });
                        dirty = true;
                    }
                }
            }
            if (dirty)
                yield this.app.vault.modify(noteFile, text);
            return res;
        });
    }
}

class FilesHandler {
    constructor(app, lh, consoleLogPrefix = "", ignoreFolders = [], ignoreFilesRegex = []) {
        this.app = app;
        this.lh = lh;
        this.consoleLogPrefix = consoleLogPrefix;
        this.ignoreFolders = ignoreFolders;
        this.ignoreFilesRegex = ignoreFilesRegex;
    }
    isPathIgnored(path) {
        if (path.startsWith("./"))
            path = path.substring(2);
        for (let folder of this.ignoreFolders) {
            if (path.startsWith(folder)) {
                return true;
            }
        }
        for (let fileRegex of this.ignoreFilesRegex) {
            let testResult = fileRegex.test(path);
            // console.log(path,fileRegex,testResult)
            if (testResult) {
                return true;
            }
        }
    }
    createFolderForAttachmentFromLink(link, owningNotePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let newFullPath = this.lh.getFullPathForLink(link, owningNotePath);
            return yield this.createFolderForAttachmentFromPath(newFullPath);
        });
    }
    createFolderForAttachmentFromPath(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let newParentFolder = filePath.substring(0, filePath.lastIndexOf("/"));
            try {
                //todo check filder exist
                yield this.app.vault.createFolder(newParentFolder);
            }
            catch (_a) { }
        });
    }
    generateFileCopyName(originalName) {
        let ext = path.extname(originalName);
        let baseName = path.basename(originalName, ext);
        let dir = path.dirname(originalName);
        for (let i = 1; i < 100000; i++) {
            let newName = dir + "/" + baseName + " " + i + ext;
            let existFile = this.lh.getFileByPath(newName);
            if (!existFile)
                return newName;
        }
        return "";
    }
    moveCachedNoteAttachments(oldNotePath, newNotePath, deleteExistFiles, attachmentsSubfolder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(oldNotePath) || this.isPathIgnored(newNotePath))
                return;
            //try to get embeds for old or new path (metadataCache can be updated or not)
            //!!! this can return undefined if note was just updated
            let embeds = (yield Utils.getCacheSafe(newNotePath)).embeds;
            if (!embeds)
                return;
            let result = {
                movedAttachments: [],
                renamedFiles: []
            };
            for (let embed of embeds) {
                let link = embed.link;
                let oldLinkPath = this.lh.getFullPathForLink(link, oldNotePath);
                if (result.movedAttachments.findIndex(x => x.oldPath == oldLinkPath) != -1)
                    continue; //already moved
                let file = this.lh.getFileByLink(link, oldNotePath);
                if (!file) {
                    file = this.lh.getFileByLink(link, newNotePath);
                    if (!file) {
                        console.error(this.consoleLogPrefix + oldNotePath + " has bad embed (file does not exist): " + link);
                        continue;
                    }
                }
                //if attachment not in the note folder, skip it
                // = "." means that note was at root path, so do not skip it
                if (path.dirname(oldNotePath) != "." && !path.dirname(oldLinkPath).startsWith(path.dirname(oldNotePath)))
                    continue;
                let newLinkPath = this.getNewAttachmentPath(file.path, newNotePath, attachmentsSubfolder);
                if (newLinkPath == file.path) //nothing to move
                    continue;
                let res = yield this.moveAttachment(file, newLinkPath, [oldNotePath, newNotePath], deleteExistFiles);
                result.movedAttachments = result.movedAttachments.concat(res.movedAttachments);
                result.renamedFiles = result.renamedFiles.concat(res.renamedFiles);
            }
            return result;
        });
    }
    getNewAttachmentPath(oldAttachmentPath, notePath, subfolderName) {
        let resolvedSubFolderName = subfolderName.replace(/\${filename}/g, path.basename(notePath, ".md"));
        let newPath = (resolvedSubFolderName == "") ? path.dirname(notePath) : path.join(path.dirname(notePath), resolvedSubFolderName);
        newPath = Utils.normalizePathForFile(path.join(newPath, path.basename(oldAttachmentPath)));
        return newPath;
    }
    collectAttachmentsForCachedNote(notePath, subfolderName, deleteExistFiles) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            let result = {
                movedAttachments: [],
                renamedFiles: []
            };
            const cache = yield Utils.getCacheSafe(notePath);
            const linkObjs = [...((_a = cache.embeds) !== null && _a !== void 0 ? _a : []), ...((_b = cache.links) !== null && _b !== void 0 ? _b : [])];
            for (let linkObj of linkObjs) {
                let link = this.lh.splitLinkToPathAndSection(linkObj.link).link;
                if (link.startsWith("#")) {
                    // internal section link
                    continue;
                }
                let fullPathLink = this.lh.getFullPathForLink(link, notePath);
                if (result.movedAttachments.findIndex(x => x.oldPath == fullPathLink) != -1) {
                    // already moved
                    continue;
                }
                let file = this.lh.getFileByLink(link, notePath);
                if (!file) {
                    const type = linkObj.original.startsWith("!") ? "embed" : "link";
                    console.error(`${this.consoleLogPrefix}${notePath} has bad ${type} (file does not exist): ${link}`);
                    continue;
                }
                const extension = file.extension.toLowerCase();
                if (extension === "md" || file.extension === "canvas") {
                    // internal file link
                    continue;
                }
                let newPath = this.getNewAttachmentPath(file.path, notePath, subfolderName);
                if (newPath == file.path) {
                    // nothing to move
                    continue;
                }
                let res = yield this.moveAttachment(file, newPath, [notePath], deleteExistFiles);
                result.movedAttachments = result.movedAttachments.concat(res.movedAttachments);
                result.renamedFiles = result.renamedFiles.concat(res.renamedFiles);
            }
            return result;
        });
    }
    moveAttachment(file, newLinkPath, parentNotePaths, deleteExistFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = file.path;
            let result = {
                movedAttachments: [],
                renamedFiles: []
            };
            if (this.isPathIgnored(path))
                return result;
            if (path == newLinkPath) {
                console.warn(this.consoleLogPrefix + "Can't move file. Source and destination path the same.");
                return result;
            }
            yield this.createFolderForAttachmentFromPath(newLinkPath);
            let linkedNotes = yield this.lh.getCachedNotesThatHaveLinkToFile(path);
            if (parentNotePaths) {
                for (let notePath of parentNotePaths) {
                    linkedNotes.remove(notePath);
                }
            }
            if (path !== file.path) {
                console.warn(this.consoleLogPrefix + "File was moved already");
                return yield this.moveAttachment(file, newLinkPath, parentNotePaths, deleteExistFiles);
            }
            //if no other file has link to this file - try to move file
            //if file already exist at new location - delete or move with new name
            if (linkedNotes.length == 0) {
                let existFile = this.lh.getFileByPath(newLinkPath);
                if (!existFile) {
                    //move
                    console.log(this.consoleLogPrefix + "move file [from, to]: \n   " + path + "\n   " + newLinkPath);
                    result.movedAttachments.push({ oldPath: path, newPath: newLinkPath });
                    yield this.app.vault.rename(file, newLinkPath);
                }
                else {
                    if (deleteExistFiles) {
                        //delete
                        console.log(this.consoleLogPrefix + "delete file: \n   " + path);
                        result.movedAttachments.push({ oldPath: path, newPath: newLinkPath });
                        yield this.app.vault.trash(file, true);
                    }
                    else {
                        //move with new name
                        let newFileCopyName = this.generateFileCopyName(newLinkPath);
                        console.log(this.consoleLogPrefix + "copy file with new name [from, to]: \n   " + path + "\n   " + newFileCopyName);
                        result.movedAttachments.push({ oldPath: path, newPath: newFileCopyName });
                        yield this.app.vault.rename(file, newFileCopyName);
                        result.renamedFiles.push({ oldPath: newLinkPath, newPath: newFileCopyName });
                    }
                }
            }
            //if some other file has link to this file - try to copy file
            //if file already exist at new location - copy file with new name or do nothing
            else {
                let existFile = this.lh.getFileByPath(newLinkPath);
                if (!existFile) {
                    //copy
                    console.log(this.consoleLogPrefix + "copy file [from, to]: \n   " + path + "\n   " + newLinkPath);
                    result.movedAttachments.push({ oldPath: path, newPath: newLinkPath });
                    yield this.app.vault.copy(file, newLinkPath);
                }
                else {
                    if (deleteExistFiles) ;
                    else {
                        //copy with new name
                        let newFileCopyName = this.generateFileCopyName(newLinkPath);
                        console.log(this.consoleLogPrefix + "copy file with new name [from, to]: \n   " + path + "\n   " + newFileCopyName);
                        result.movedAttachments.push({ oldPath: file.path, newPath: newFileCopyName });
                        yield this.app.vault.copy(file, newFileCopyName);
                        result.renamedFiles.push({ oldPath: newLinkPath, newPath: newFileCopyName });
                    }
                }
            }
            return result;
        });
    }
    deleteEmptyFolders(dirName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(dirName))
                return;
            if (dirName.startsWith("./"))
                dirName = dirName.substring(2);
            let list = yield this.app.vault.adapter.list(dirName);
            for (let folder of list.folders) {
                yield this.deleteEmptyFolders(folder);
            }
            list = yield this.app.vault.adapter.list(dirName);
            if (list.files.length == 0 && list.folders.length == 0) {
                console.log(this.consoleLogPrefix + "delete empty folder: \n   " + dirName);
                if (yield this.app.vault.adapter.exists(dirName))
                    yield this.app.vault.adapter.rmdir(dirName, false);
            }
        });
    }
    deleteUnusedAttachmentsForCachedNote(notePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(notePath))
                return;
            //!!! this can return undefined if note was just updated
            let embeds = (yield Utils.getCacheSafe(notePath)).embeds;
            if (embeds) {
                for (let embed of embeds) {
                    let link = embed.link;
                    let fullPath = this.lh.getFullPathForLink(link, notePath);
                    let linkedNotes = yield this.lh.getCachedNotesThatHaveLinkToFile(fullPath);
                    if (linkedNotes.length == 0) {
                        let file = this.lh.getFileByLink(link, notePath, false);
                        if (file) {
                            try {
                                yield this.app.vault.trash(file, true);
                            }
                            catch (_a) { }
                        }
                    }
                }
            }
        });
    }
}

class ConsistentAttachmentsAndLinks extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.recentlyRenamedFiles = [];
        this.currentlyRenamingFiles = [];
        this.renamingIsActive = false;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new SettingTab(this.app, this));
            this.registerEvent(this.app.vault.on('delete', (file) => this.handleDeletedFile(file)));
            this.registerEvent(this.app.vault.on('rename', (file, oldPath) => this.handleRenamedFile(file, oldPath)));
            this.addCommand({
                id: 'collect-all-attachments',
                name: 'Collect All Attachments',
                callback: () => this.collectAllAttachments(),
            });
            this.addCommand({
                id: 'collect-attachments-current-note',
                name: 'Collect Attachments in Current Note',
                editorCallback: (editor, view) => this.collectAttachmentsCurrentNote(editor, view),
            });
            this.addCommand({
                id: 'delete-empty-folders',
                name: 'Delete Empty Folders',
                callback: () => this.deleteEmptyFolders(),
            });
            this.addCommand({
                id: 'convert-all-link-paths-to-relative',
                name: 'Convert All Link Paths to Relative',
                callback: () => this.convertAllLinkPathsToRelative(),
            });
            this.addCommand({
                id: 'convert-all-embed-paths-to-relative',
                name: 'Convert All Embed Paths to Relative',
                callback: () => this.convertAllEmbedsPathsToRelative(),
            });
            this.addCommand({
                id: 'replace-all-wikilinks-with-markdown-links',
                name: 'Replace All Wiki Links with Markdown Links',
                callback: () => this.replaceAllWikilinksWithMarkdownLinks(),
            });
            this.addCommand({
                id: 'reorganize-vault',
                name: 'Reorganize Vault',
                callback: () => this.reorganizeVault(),
            });
            this.addCommand({
                id: 'check-consistency',
                name: 'Check Vault consistency',
                callback: () => this.checkConsistency(),
            });
            // make regex from given strings
            this.settings.ignoreFilesRegex = this.settings.ignoreFiles.map((val) => RegExp(val));
            this.lh = new LinksHandler(this.app, 'Consistent Attachments and Links: ', this.settings.ignoreFolders, this.settings.ignoreFilesRegex);
            this.fh = new FilesHandler(this.app, this.lh, 'Consistent Attachments and Links: ', this.settings.ignoreFolders, this.settings.ignoreFilesRegex);
        });
    }
    isPathIgnored(path) {
        if (path.startsWith('./'))
            path = path.substring(2);
        for (let folder of this.settings.ignoreFolders) {
            if (path.startsWith(folder)) {
                return true;
            }
        }
        for (let fileRegex of this.settings.ignoreFilesRegex) {
            if (fileRegex.test(path)) {
                return true;
            }
        }
    }
    handleDeletedFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPathIgnored(file.path))
                return;
            let fileExt = file.path.substring(file.path.lastIndexOf('.'));
            if (fileExt == '.md') {
                if (this.settings.deleteAttachmentsWithNote) {
                    yield this.fh.deleteUnusedAttachmentsForCachedNote(file.path);
                }
                //delete child folders (do not delete parent)
                if (this.settings.deleteEmptyFolders) {
                    if (yield this.app.vault.adapter.exists(path.dirname(file.path))) {
                        let list = yield this.app.vault.adapter.list(path.dirname(file.path));
                        for (let folder of list.folders) {
                            yield this.fh.deleteEmptyFolders(folder);
                        }
                    }
                }
            }
        });
    }
    handleRenamedFile(file, oldPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.recentlyRenamedFiles.push({ oldPath: oldPath, newPath: file.path });
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => {
                this.HandleRecentlyRenamedFiles();
            }, 3000);
        });
    }
    HandleRecentlyRenamedFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.recentlyRenamedFiles || this.recentlyRenamedFiles.length == 0)
                //nothing to rename
                return;
            if (this.renamingIsActive)
                //already started
                return;
            this.renamingIsActive = true;
            this.currentlyRenamingFiles = this.recentlyRenamedFiles; //clear array for pushing new files async
            this.recentlyRenamedFiles = [];
            // new Notice("Fixing consistency for " + this.currentlyRenamingFiles.length + " renamed files" + "...");
            console.log('Consistent Attachments and Links:\nFixing consistency for ' +
                this.currentlyRenamingFiles.length +
                ' renamed files' +
                '...');
            try {
                for (let file of this.currentlyRenamingFiles) {
                    if (this.isPathIgnored(file.newPath) ||
                        this.isPathIgnored(file.oldPath))
                        return;
                    // await Utils.delay(10); //waiting for update vault
                    let result;
                    let fileExt = file.oldPath.substring(file.oldPath.lastIndexOf('.'));
                    if (fileExt == '.md') {
                        // await Utils.delay(500);//waiting for update metadataCache
                        if (path.dirname(file.oldPath) != path.dirname(file.newPath) ||
                            this.settings.attachmentsSubfolder.contains('${filename}')) {
                            if (this.settings.moveAttachmentsWithNote) {
                                result = yield this.fh.moveCachedNoteAttachments(file.oldPath, file.newPath, this.settings.deleteExistFilesWhenMoveNote, this.settings.attachmentsSubfolder);
                                if (this.settings.updateLinks && result) {
                                    let changedFiles = result.renamedFiles.concat(result.movedAttachments);
                                    if (changedFiles.length > 0) {
                                        yield this.lh.updateChangedPathsInNote(file.newPath, changedFiles);
                                    }
                                }
                            }
                            if (this.settings.updateLinks) {
                                yield this.lh.updateInternalLinksInMovedNote(file.oldPath, file.newPath, this.settings.moveAttachmentsWithNote);
                            }
                            //delete child folders (do not delete parent)
                            if (this.settings.deleteEmptyFolders) {
                                if (yield this.app.vault.adapter.exists(path.dirname(file.oldPath))) {
                                    let list = yield this.app.vault.adapter.list(path.dirname(file.oldPath));
                                    for (let folder of list.folders) {
                                        yield this.fh.deleteEmptyFolders(folder);
                                    }
                                }
                            }
                        }
                    }
                    let updateAlts = this.settings.changeNoteBacklinksAlt && fileExt == '.md';
                    if (this.settings.updateLinks) {
                        yield this.lh.updateLinksToRenamedFile(file.oldPath, file.newPath, updateAlts, this.settings.useBuiltInObsidianLinkCaching);
                    }
                    if (result &&
                        result.movedAttachments &&
                        result.movedAttachments.length > 0) {
                        new obsidian.Notice('Moved ' +
                            result.movedAttachments.length +
                            ' attachment' +
                            (result.movedAttachments.length > 1 ? 's' : ''));
                    }
                }
            }
            catch (e) {
                console.error('Consistent Attachments and Links: \n' + e);
            }
            // new Notice('Fixing Consistency Complete');
            console.log('Consistent Attachments and Links:\nFixing consistency complete');
            this.renamingIsActive = false;
            if (this.recentlyRenamedFiles && this.recentlyRenamedFiles.length > 0) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(() => {
                    this.HandleRecentlyRenamedFiles();
                }, 500);
            }
        });
    }
    collectAttachmentsCurrentNote(editor, view) {
        return __awaiter(this, void 0, void 0, function* () {
            let note = view.file;
            if (this.isPathIgnored(note.path)) {
                new obsidian.Notice('Note path is ignored');
                return;
            }
            let result = yield this.fh.collectAttachmentsForCachedNote(note.path, this.settings.attachmentsSubfolder, this.settings.deleteExistFilesWhenMoveNote);
            if (result &&
                result.movedAttachments &&
                result.movedAttachments.length > 0) {
                yield this.lh.updateChangedPathsInNote(note.path, result.movedAttachments);
            }
            if (result.movedAttachments.length == 0)
                new obsidian.Notice('No files found that need to be moved');
            else
                new obsidian.Notice('Moved ' +
                    result.movedAttachments.length +
                    ' attachment' +
                    (result.movedAttachments.length > 1 ? 's' : ''));
        });
    }
    collectAllAttachments() {
        return __awaiter(this, void 0, void 0, function* () {
            let movedAttachmentsCount = 0;
            let processedNotesCount = 0;
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let result = yield this.fh.collectAttachmentsForCachedNote(note.path, this.settings.attachmentsSubfolder, this.settings.deleteExistFilesWhenMoveNote);
                    if (result &&
                        result.movedAttachments &&
                        result.movedAttachments.length > 0) {
                        yield this.lh.updateChangedPathsInNote(note.path, result.movedAttachments);
                        movedAttachmentsCount += result.movedAttachments.length;
                        processedNotesCount++;
                    }
                }
            }
            if (movedAttachmentsCount == 0)
                new obsidian.Notice('No files found that need to be moved');
            else
                new obsidian.Notice('Moved ' +
                    movedAttachmentsCount +
                    ' attachment' +
                    (movedAttachmentsCount > 1 ? 's' : '') +
                    ' from ' +
                    processedNotesCount +
                    ' note' +
                    (processedNotesCount > 1 ? 's' : ''));
        });
    }
    convertAllEmbedsPathsToRelative() {
        return __awaiter(this, void 0, void 0, function* () {
            let changedEmbedCount = 0;
            let processedNotesCount = 0;
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let result = yield this.lh.convertAllNoteEmbedsPathsToRelative(note.path);
                    if (result && result.length > 0) {
                        changedEmbedCount += result.length;
                        processedNotesCount++;
                    }
                }
            }
            if (changedEmbedCount == 0)
                new obsidian.Notice('No embeds found that need to be converted');
            else
                new obsidian.Notice('Converted ' +
                    changedEmbedCount +
                    ' embed' +
                    (changedEmbedCount > 1 ? 's' : '') +
                    ' from ' +
                    processedNotesCount +
                    ' note' +
                    (processedNotesCount > 1 ? 's' : ''));
        });
    }
    convertAllLinkPathsToRelative() {
        return __awaiter(this, void 0, void 0, function* () {
            let changedLinksCount = 0;
            let processedNotesCount = 0;
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let result = yield this.lh.convertAllNoteLinksPathsToRelative(note.path);
                    if (result && result.length > 0) {
                        changedLinksCount += result.length;
                        processedNotesCount++;
                    }
                }
            }
            if (changedLinksCount == 0)
                new obsidian.Notice('No links found that need to be converted');
            else
                new obsidian.Notice('Converted ' +
                    changedLinksCount +
                    ' link' +
                    (changedLinksCount > 1 ? 's' : '') +
                    ' from ' +
                    processedNotesCount +
                    ' note' +
                    (processedNotesCount > 1 ? 's' : ''));
        });
    }
    replaceAllWikilinksWithMarkdownLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let changedLinksCount = 0;
            let processedNotesCount = 0;
            let notes = this.app.vault.getMarkdownFiles();
            if (notes) {
                for (let note of notes) {
                    if (this.isPathIgnored(note.path))
                        continue;
                    let result = yield this.lh.replaceAllNoteWikilinksWithMarkdownLinks(note.path);
                    if (result && (result.links.length > 0 || result.embeds.length > 0)) {
                        changedLinksCount += result.links.length;
                        changedLinksCount += result.embeds.length;
                        processedNotesCount++;
                    }
                }
            }
            if (changedLinksCount == 0)
                new obsidian.Notice('No wiki links found that need to be replaced');
            else
                new obsidian.Notice('Replaced ' +
                    changedLinksCount +
                    ' wikilink' +
                    (changedLinksCount > 1 ? 's' : '') +
                    ' from ' +
                    processedNotesCount +
                    ' note' +
                    (processedNotesCount > 1 ? 's' : ''));
        });
    }
    deleteEmptyFolders() {
        this.fh.deleteEmptyFolders('/');
    }
    checkConsistency() {
        return __awaiter(this, void 0, void 0, function* () {
            let badLinks = yield this.lh.getAllBadLinks();
            let badSectionLinks = yield this.lh.getAllBadSectionLinks();
            let badEmbeds = yield this.lh.getAllBadEmbeds();
            let wikiLinks = yield this.lh.getAllWikiLinks();
            let wikiEmbeds = yield this.lh.getAllWikiEmbeds();
            let text = '';
            let badLinksCount = Object.keys(badLinks).length;
            let badEmbedsCount = Object.keys(badEmbeds).length;
            let badSectionLinksCount = Object.keys(badSectionLinks).length;
            let wikiLinksCount = Object.keys(wikiLinks).length;
            let wikiEmbedsCount = Object.keys(wikiEmbeds).length;
            if (badLinksCount > 0) {
                text += '# Bad links (' + badLinksCount + ' files)\n';
                for (let note in badLinks) {
                    text +=
                        '[' + note + '](' + Utils.normalizePathForLink(note) + '): ' + '\n';
                    for (let link of badLinks[note]) {
                        text +=
                            '- (line ' +
                                (link.position.start.line + 1) +
                                '): `' +
                                link.link +
                                '`\n';
                    }
                    text += '\n\n';
                }
            }
            else {
                text += '# Bad links \n';
                text += 'No problems found\n\n';
            }
            if (badSectionLinksCount > 0) {
                text +=
                    '\n\n# Bad note link sections (' + badSectionLinksCount + ' files)\n';
                for (let note in badSectionLinks) {
                    text +=
                        '[' + note + '](' + Utils.normalizePathForLink(note) + '): ' + '\n';
                    for (let link of badSectionLinks[note]) {
                        let li = this.lh.splitLinkToPathAndSection(link.link);
                        let section = Utils.normalizeLinkSection(li.section);
                        text +=
                            '- (line ' +
                                (link.position.start.line + 1) +
                                '): `' +
                                li.link +
                                '#' +
                                section +
                                '`\n';
                    }
                    text += '\n\n';
                }
            }
            else {
                text += '\n\n# Bad note link sections\n';
                text += 'No problems found\n\n';
            }
            if (badEmbedsCount > 0) {
                text += '\n\n# Bad embeds (' + badEmbedsCount + ' files)\n';
                for (let note in badEmbeds) {
                    text +=
                        '[' + note + '](' + Utils.normalizePathForLink(note) + '): ' + '\n';
                    for (let link of badEmbeds[note]) {
                        text +=
                            '- (line ' +
                                (link.position.start.line + 1) +
                                '): `' +
                                link.link +
                                '`\n';
                    }
                    text += '\n\n';
                }
            }
            else {
                text += '\n\n# Bad embeds \n';
                text += 'No problems found\n\n';
            }
            if (wikiLinksCount > 0) {
                text += '# Wiki links (' + wikiLinksCount + ' files)\n';
                for (let note in wikiLinks) {
                    text +=
                        '[' + note + '](' + Utils.normalizePathForLink(note) + '): ' + '\n';
                    for (let link of wikiLinks[note]) {
                        text +=
                            '- (line ' +
                                (link.position.start.line + 1) +
                                '): `' +
                                link.original +
                                '`\n';
                    }
                    text += '\n\n';
                }
            }
            else {
                text += '# Wiki links \n';
                text += 'No problems found\n\n';
            }
            if (wikiEmbedsCount > 0) {
                text += '\n\n# Wiki embeds (' + wikiEmbedsCount + ' files)\n';
                for (let note in wikiEmbeds) {
                    text +=
                        '[' + note + '](' + Utils.normalizePathForLink(note) + '): ' + '\n';
                    for (let link of wikiEmbeds[note]) {
                        text +=
                            '- (line ' +
                                (link.position.start.line + 1) +
                                '): `' +
                                link.original +
                                '`\n';
                    }
                    text += '\n\n';
                }
            }
            else {
                text += '\n\n# Wiki embeds \n';
                text += 'No problems found\n\n';
            }
            let notePath = this.settings.consistencyReportFile;
            yield this.app.vault.adapter.write(notePath, text);
            let fileOpened = false;
            this.app.workspace.iterateAllLeaves((leaf) => {
                if (leaf.getDisplayText() != '' &&
                    notePath.startsWith(leaf.getDisplayText())) {
                    fileOpened = true;
                }
            });
            if (!fileOpened)
                this.app.workspace.openLinkText(notePath, '/', false);
        });
    }
    reorganizeVault() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.replaceAllWikilinksWithMarkdownLinks();
            yield this.convertAllEmbedsPathsToRelative();
            yield this.convertAllLinkPathsToRelative();
            //- Rename all attachments (using Unique attachments, optional)
            yield this.collectAllAttachments();
            yield this.deleteEmptyFolders();
            new obsidian.Notice('Reorganization of the vault completed');
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            this.lh = new LinksHandler(this.app, 'Consistent Attachments and Links: ', this.settings.ignoreFolders, this.settings.ignoreFilesRegex);
            this.fh = new FilesHandler(this.app, this.lh, 'Consistent Attachments and Links: ', this.settings.ignoreFolders, this.settings.ignoreFilesRegex);
        });
    }
}

module.exports = ConsistentAttachmentsAndLinks;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vQ29kZS91dGlsaXRpZXMvb2JzaWRpYW4tY29uc2lzdGVudC1hdHRhY2htZW50cy1hbmQtbGlua3Mvbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uLy4uLy4uL0NvZGUvdXRpbGl0aWVzL29ic2lkaWFuLWNvbnNpc3RlbnQtYXR0YWNobWVudHMtYW5kLWxpbmtzL3NyYy9zZXR0aW5ncy50cyIsIi4uLy4uLy4uLy4uLy4uL0NvZGUvdXRpbGl0aWVzL29ic2lkaWFuLWNvbnNpc3RlbnQtYXR0YWNobWVudHMtYW5kLWxpbmtzL3NyYy91dGlscy50cyIsIi4uLy4uLy4uLy4uLy4uL0NvZGUvdXRpbGl0aWVzL29ic2lkaWFuLWNvbnNpc3RlbnQtYXR0YWNobWVudHMtYW5kLWxpbmtzL3NyYy9wYXRoLnRzIiwiLi4vLi4vLi4vLi4vLi4vQ29kZS91dGlsaXRpZXMvb2JzaWRpYW4tY29uc2lzdGVudC1hdHRhY2htZW50cy1hbmQtbGlua3Mvc3JjL2xpbmtzLWhhbmRsZXIudHMiLCIuLi8uLi8uLi8uLi8uLi9Db2RlL3V0aWxpdGllcy9vYnNpZGlhbi1jb25zaXN0ZW50LWF0dGFjaG1lbnRzLWFuZC1saW5rcy9zcmMvZmlsZXMtaGFuZGxlci50cyIsIi4uLy4uLy4uLy4uLy4uL0NvZGUvdXRpbGl0aWVzL29ic2lkaWFuLWNvbnNpc3RlbnQtYXR0YWNobWVudHMtYW5kLWxpbmtzL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xyXG4gICAgZnVuY3Rpb24gYWNjZXB0KGYpIHsgaWYgKGYgIT09IHZvaWQgMCAmJiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24gZXhwZWN0ZWRcIik7IHJldHVybiBmOyB9XHJcbiAgICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xyXG4gICAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XHJcbiAgICB2YXIgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JJbiB8fCAodGFyZ2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGNvbnRleHRJbi5uYW1lKSA6IHt9KTtcclxuICAgIHZhciBfLCBkb25lID0gZmFsc2U7XHJcbiAgICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XHJcbiAgICAgICAgY29udGV4dC5hZGRJbml0aWFsaXplciA9IGZ1bmN0aW9uIChmKSB7IGlmIChkb25lKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGFkZCBpbml0aWFsaXplcnMgYWZ0ZXIgZGVjb3JhdGlvbiBoYXMgY29tcGxldGVkXCIpOyBleHRyYUluaXRpYWxpemVycy5wdXNoKGFjY2VwdChmIHx8IG51bGwpKTsgfTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcclxuICAgICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LnNldCkpIGRlc2NyaXB0b3Iuc2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoXyA9IGFjY2VwdChyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xyXG4gICAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xyXG4gICAgZG9uZSA9IHRydWU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19ydW5Jbml0aWFsaXplcnModGhpc0FyZywgaW5pdGlhbGl6ZXJzLCB2YWx1ZSkge1xyXG4gICAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhbHVlID0gdXNlVmFsdWUgPyBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnLCB2YWx1ZSkgOiBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHggPT09IFwic3ltYm9sXCIgPyB4IDogXCJcIi5jb25jYXQoeCk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zZXRGdW5jdGlvbk5hbWUoZiwgbmFtZSwgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XHJcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IGZhbHNlIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hZGREaXNwb3NhYmxlUmVzb3VyY2UoZW52LCB2YWx1ZSwgYXN5bmMpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XHJcbiAgICAgICAgdmFyIGRpc3Bvc2U7XHJcbiAgICAgICAgaWYgKGFzeW5jKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgICAgICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcclxuICAgICAgICAgICAgaWYgKCFTeW1ib2wuZGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5kaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkaXNwb3NlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qgbm90IGRpc3Bvc2FibGUuXCIpO1xyXG4gICAgICAgIGVudi5zdGFjay5wdXNoKHsgdmFsdWU6IHZhbHVlLCBkaXNwb3NlOiBkaXNwb3NlLCBhc3luYzogYXN5bmMgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhc3luYykge1xyXG4gICAgICAgIGVudi5zdGFjay5wdXNoKHsgYXN5bmM6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XHJcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIHJldHVybiBlLm5hbWUgPSBcIlN1cHByZXNzZWRFcnJvclwiLCBlLmVycm9yID0gZXJyb3IsIGUuc3VwcHJlc3NlZCA9IHN1cHByZXNzZWQsIGU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kaXNwb3NlUmVzb3VyY2VzKGVudikge1xyXG4gICAgZnVuY3Rpb24gZmFpbChlKSB7XHJcbiAgICAgICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xyXG4gICAgICAgIGVudi5oYXNFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgIHdoaWxlIChlbnYuc3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciByZWMgPSBlbnYuc3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVjLmRpc3Bvc2UgJiYgcmVjLmRpc3Bvc2UuY2FsbChyZWMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlYy5hc3luYykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgZmFpbChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZW52Lmhhc0Vycm9yKSB0aHJvdyBlbnYuZXJyb3I7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV4dCgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBfX2V4dGVuZHM6IF9fZXh0ZW5kcyxcclxuICAgIF9fYXNzaWduOiBfX2Fzc2lnbixcclxuICAgIF9fcmVzdDogX19yZXN0LFxyXG4gICAgX19kZWNvcmF0ZTogX19kZWNvcmF0ZSxcclxuICAgIF9fcGFyYW06IF9fcGFyYW0sXHJcbiAgICBfX21ldGFkYXRhOiBfX21ldGFkYXRhLFxyXG4gICAgX19hd2FpdGVyOiBfX2F3YWl0ZXIsXHJcbiAgICBfX2dlbmVyYXRvcjogX19nZW5lcmF0b3IsXHJcbiAgICBfX2NyZWF0ZUJpbmRpbmc6IF9fY3JlYXRlQmluZGluZyxcclxuICAgIF9fZXhwb3J0U3RhcjogX19leHBvcnRTdGFyLFxyXG4gICAgX192YWx1ZXM6IF9fdmFsdWVzLFxyXG4gICAgX19yZWFkOiBfX3JlYWQsXHJcbiAgICBfX3NwcmVhZDogX19zcHJlYWQsXHJcbiAgICBfX3NwcmVhZEFycmF5czogX19zcHJlYWRBcnJheXMsXHJcbiAgICBfX3NwcmVhZEFycmF5OiBfX3NwcmVhZEFycmF5LFxyXG4gICAgX19hd2FpdDogX19hd2FpdCxcclxuICAgIF9fYXN5bmNHZW5lcmF0b3I6IF9fYXN5bmNHZW5lcmF0b3IsXHJcbiAgICBfX2FzeW5jRGVsZWdhdG9yOiBfX2FzeW5jRGVsZWdhdG9yLFxyXG4gICAgX19hc3luY1ZhbHVlczogX19hc3luY1ZhbHVlcyxcclxuICAgIF9fbWFrZVRlbXBsYXRlT2JqZWN0OiBfX21ha2VUZW1wbGF0ZU9iamVjdCxcclxuICAgIF9faW1wb3J0U3RhcjogX19pbXBvcnRTdGFyLFxyXG4gICAgX19pbXBvcnREZWZhdWx0OiBfX2ltcG9ydERlZmF1bHQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0OiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldDogX19jbGFzc1ByaXZhdGVGaWVsZFNldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRJbjogX19jbGFzc1ByaXZhdGVGaWVsZEluLFxyXG4gICAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2U6IF9fYWRkRGlzcG9zYWJsZVJlc291cmNlLFxyXG4gICAgX19kaXNwb3NlUmVzb3VyY2VzOiBfX2Rpc3Bvc2VSZXNvdXJjZXMsXHJcbn07XHJcbiIsImltcG9ydCB7IEFwcCwgbm9ybWFsaXplUGF0aCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCBDb25zaXN0ZW50QXR0YWNobWVudHNBbmRMaW5rcyBmcm9tICcuL21haW4nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5TZXR0aW5ncyB7XHJcbiAgICBtb3ZlQXR0YWNobWVudHNXaXRoTm90ZTogYm9vbGVhbjtcclxuICAgIGRlbGV0ZUF0dGFjaG1lbnRzV2l0aE5vdGU6IGJvb2xlYW47XHJcbiAgICB1cGRhdGVMaW5rczogYm9vbGVhbjtcclxuICAgIGRlbGV0ZUVtcHR5Rm9sZGVyczogYm9vbGVhbjtcclxuICAgIGRlbGV0ZUV4aXN0RmlsZXNXaGVuTW92ZU5vdGU6IGJvb2xlYW47XHJcbiAgICBjaGFuZ2VOb3RlQmFja2xpbmtzQWx0OiBib29sZWFuO1xyXG4gICAgaWdub3JlRm9sZGVyczogc3RyaW5nW107XHJcbiAgICBpZ25vcmVGaWxlczogc3RyaW5nW107XHJcbiAgICBpZ25vcmVGaWxlc1JlZ2V4OiBSZWdFeHBbXTtcclxuICAgIGF0dGFjaG1lbnRzU3ViZm9sZGVyOiBzdHJpbmc7XHJcbiAgICBjb25zaXN0ZW5jeVJlcG9ydEZpbGU6IHN0cmluZztcclxuICAgIHVzZUJ1aWx0SW5PYnNpZGlhbkxpbmtDYWNoaW5nOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogUGx1Z2luU2V0dGluZ3MgPSB7XHJcbiAgICBtb3ZlQXR0YWNobWVudHNXaXRoTm90ZTogdHJ1ZSxcclxuICAgIGRlbGV0ZUF0dGFjaG1lbnRzV2l0aE5vdGU6IHRydWUsXHJcbiAgICB1cGRhdGVMaW5rczogdHJ1ZSxcclxuICAgIGRlbGV0ZUVtcHR5Rm9sZGVyczogdHJ1ZSxcclxuICAgIGRlbGV0ZUV4aXN0RmlsZXNXaGVuTW92ZU5vdGU6IHRydWUsXHJcbiAgICBjaGFuZ2VOb3RlQmFja2xpbmtzQWx0OiBmYWxzZSxcclxuICAgIGlnbm9yZUZvbGRlcnM6IFtcIi5naXQvXCIsIFwiLm9ic2lkaWFuL1wiXSxcclxuICAgIGlnbm9yZUZpbGVzOiBbXCJjb25zaXN0ZW5jeVxcXFwtcmVwb3J0XFxcXC5tZFwiXSxcclxuICAgIGlnbm9yZUZpbGVzUmVnZXg6IFsvY29uc2lzdGVuY3lcXC1yZXBvcnRcXC5tZC9dLFxyXG4gICAgYXR0YWNobWVudHNTdWJmb2xkZXI6IFwiXCIsXHJcbiAgICBjb25zaXN0ZW5jeVJlcG9ydEZpbGU6IFwiY29uc2lzdGVuY3ktcmVwb3J0Lm1kXCIsXHJcbiAgICB1c2VCdWlsdEluT2JzaWRpYW5MaW5rQ2FjaGluZzogZmFsc2UsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcbiAgICBwbHVnaW46IENvbnNpc3RlbnRBdHRhY2htZW50c0FuZExpbmtzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IENvbnNpc3RlbnRBdHRhY2htZW50c0FuZExpbmtzKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ0NvbnNpc3RlbnQgYXR0YWNobWVudHMgYW5kIGxpbmtzIC0gU2V0dGluZ3MnIH0pO1xyXG5cclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdNb3ZlIEF0dGFjaG1lbnRzIHdpdGggTm90ZScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdBdXRvbWF0aWNhbGx5IG1vdmUgYXR0YWNobWVudHMgd2hlbiBhIG5vdGUgaXMgcmVsb2NhdGVkLiBUaGlzIGluY2x1ZGVzIGF0dGFjaG1lbnRzIGxvY2F0ZWQgaW4gdGhlIHNhbWUgZm9sZGVyIG9yIGFueSBvZiBpdHMgc3ViZm9sZGVycy4nKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKGNiID0+IGNiLm9uQ2hhbmdlKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vdmVBdHRhY2htZW50c1dpdGhOb3RlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vdmVBdHRhY2htZW50c1dpdGhOb3RlKSk7XHJcblxyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0RlbGV0ZSBVbnVzZWQgQXR0YWNobWVudHMgd2l0aCBOb3RlJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ0F1dG9tYXRpY2FsbHkgcmVtb3ZlIGF0dGFjaG1lbnRzIHRoYXQgYXJlIG5vIGxvbmdlciByZWZlcmVuY2VkIGluIG90aGVyIG5vdGVzIHdoZW4gdGhlIG5vdGUgaXMgZGVsZXRlZC4nKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKGNiID0+IGNiLm9uQ2hhbmdlKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGV0ZUF0dGFjaG1lbnRzV2l0aE5vdGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsZXRlQXR0YWNobWVudHNXaXRoTm90ZSkpO1xyXG5cclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdVcGRhdGUgTGlua3MnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnQXV0b21hdGljYWxseSB1cGRhdGUgbGlua3MgdG8gYXR0YWNobWVudHMgYW5kIG90aGVyIG5vdGVzIHdoZW4gbW92aW5nIG5vdGVzIG9yIGF0dGFjaG1lbnRzLicpXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoY2IgPT4gY2Iub25DaGFuZ2UodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXBkYXRlTGlua3MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBkYXRlTGlua3MpKTtcclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdEZWxldGUgRW1wdHkgRm9sZGVycycpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdBdXRvbWF0aWNhbGx5IHJlbW92ZSBlbXB0eSBmb2xkZXJzIGFmdGVyIG1vdmluZyBub3RlcyB3aXRoIGF0dGFjaG1lbnRzLicpXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoY2IgPT4gY2Iub25DaGFuZ2UodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsZXRlRW1wdHlGb2xkZXJzID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGV0ZUVtcHR5Rm9sZGVycykpO1xyXG5cclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdEZWxldGUgRHVwbGljYXRlIEF0dGFjaG1lbnRzIG9uIE5vdGUgTW92ZScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdBdXRvbWF0aWNhbGx5IGRlbGV0ZSBhdHRhY2htZW50cyB3aGVuIG1vdmluZyBhIG5vdGUgaWYgYSBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZSBleGlzdHMgaW4gdGhlIGRlc3RpbmF0aW9uIGZvbGRlci4gSWYgZGlzYWJsZWQsIHRoZSBmaWxlIHdpbGwgYmUgcmVuYW1lZCBhbmQgbW92ZWQuJylcclxuICAgICAgICAgICAgLmFkZFRvZ2dsZShjYiA9PiBjYi5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxldGVFeGlzdEZpbGVzV2hlbk1vdmVOb3RlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGV0ZUV4aXN0RmlsZXNXaGVuTW92ZU5vdGUpKTtcclxuXHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnVXBkYXRlIEJhY2tsaW5rIFRleHQgb24gTm90ZSBSZW5hbWUnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnV2hlbiBhIG5vdGUgaXMgcmVuYW1lZCwgaXRzIGxpbmtlZCByZWZlcmVuY2VzIGFyZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQuIElmIHRoaXMgb3B0aW9uIGlzIGVuYWJsZWQsIHRoZSB0ZXh0IG9mIGJhY2tsaW5rcyB0byB0aGlzIG5vdGUgd2lsbCBhbHNvIGJlIG1vZGlmaWVkLicpXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoY2IgPT4gY2Iub25DaGFuZ2UodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2hhbmdlTm90ZUJhY2tsaW5rc0FsdCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jaGFuZ2VOb3RlQmFja2xpbmtzQWx0KSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKFwiSWdub3JlIEZvbGRlcnNcIilcclxuICAgICAgICAgICAgLnNldERlc2MoXCJTcGVjaWZ5IGEgbGlzdCBvZiBmb2xkZXJzIHRvIGlnbm9yZS4gRW50ZXIgZWFjaCBmb2xkZXIgb24gYSBuZXcgbGluZS5cIilcclxuICAgICAgICAgICAgLmFkZFRleHRBcmVhKGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiAuZ2l0LCAub2JzaWRpYW5cIilcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVGb2xkZXJzLmpvaW4oXCJcXG5cIikpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGhzID0gdmFsdWUudHJpbSgpLnNwbGl0KFwiXFxuXCIpLm1hcCh2YWx1ZSA9PiB0aGlzLmdldE5vcm1hbGl6ZWRQYXRoKHZhbHVlKSArIFwiL1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVGb2xkZXJzID0gcGF0aHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZShcIklnbm9yZSBGaWxlc1wiKVxyXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlNwZWNpZnkgYSBsaXN0IG9mIGZpbGVzIHRvIGlnbm9yZS4gRW50ZXIgZWFjaCBmaWxlIG9uIGEgbmV3IGxpbmUuXCIpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0QXJlYShjYiA9PiBjYlxyXG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogY29uc2lzdGFudC1yZXBvcnQubWRcIilcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVGaWxlcy5qb2luKFwiXFxuXCIpKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRocyA9IHZhbHVlLnRyaW0oKS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVGaWxlcyA9IHBhdGhzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZUZpbGVzUmVnZXggPSBwYXRocy5tYXAoZmlsZSA9PiBSZWdFeHAoZmlsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoXCJBdHRhY2htZW50IFN1YmZvbGRlclwiKVxyXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlNwZWNpZnkgdGhlIHN1YmZvbGRlciB3aXRoaW4gdGhlIG5vdGUgZm9sZGVyIHRvIGNvbGxlY3QgYXR0YWNobWVudHMgaW50byB3aGVuIHVzaW5nIHRoZSBcXFwiQ29sbGVjdCBBbGwgQXR0YWNobWVudHNcXFwiIGhvdGtleS4gTGVhdmUgZW1wdHkgdG8gY29sbGVjdCBhdHRhY2htZW50cyBkaXJlY3RseSBpbnRvIHRoZSBub3RlIGZvbGRlci4gWW91IGNhbiB1c2UgJHtmaWxlbmFtZX0gYXMgYSBwbGFjZWhvbGRlciBmb3IgdGhlIGN1cnJlbnQgbm90ZSBuYW1lLlwiKVxyXG4gICAgICAgICAgICAuYWRkVGV4dChjYiA9PiBjYlxyXG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogX2F0dGFjaG1lbnRzXCIpXHJcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXR0YWNobWVudHNTdWJmb2xkZXIpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXR0YWNobWVudHNTdWJmb2xkZXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZShcIkNvbnNpc3RlbmN5IFJlcG9ydCBGaWxlbmFtZVwiKVxyXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGZpbGUgZm9yIHRoZSBjb25zaXN0ZW5jeSByZXBvcnQuXCIpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0KGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiBjb25zaXN0ZW5jeS1yZXBvcnQubWRcIilcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25zaXN0ZW5jeVJlcG9ydEZpbGUpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uc2lzdGVuY3lSZXBvcnRGaWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoXCJFWFBFUklNRU5UQUw6IFVzZSBCdWlsdC1pbiBPYnNpZGlhbiBMaW5rIENhY2hpbmcgZm9yIE1vdmVkIE5vdGVzXCIpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKFwiRW5hYmxlIHRoaXMgb3B0aW9uIHRvIHVzZSB0aGUgZXhwZXJpbWVudGFsIGJ1aWx0LWluIE9ic2lkaWFuIGxpbmsgY2FjaGluZyBmb3IgcHJvY2Vzc2luZyBtb3ZlZCBub3Rlcy4gVHVybiBpdCBvZmYgaWYgdGhlIHBsdWdpbiBtaXNiZWhhdmVzLlwiKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKGNiID0+IGNiLm9uQ2hhbmdlKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZUJ1aWx0SW5PYnNpZGlhbkxpbmtDYWNoaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZUJ1aWx0SW5PYnNpZGlhbkxpbmtDYWNoaW5nKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9ybWFsaXplZFBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcGF0aC5sZW5ndGggPT0gMCA/IHBhdGggOiBub3JtYWxpemVQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlscyB7XHJcblxyXG5cdHN0YXRpYyBhc3luYyBkZWxheShtczogbnVtYmVyKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcblx0fVxyXG5cclxuXHJcblx0c3RhdGljIG5vcm1hbGl6ZVBhdGhGb3JGaWxlKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2dpLCBcIi9cIik7IC8vcmVwbGFjZSBcXCB0byAvXHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC8lMjAvZ2ksIFwiIFwiKTsgLy9yZXBsYWNlICUyMCB0byBzcGFjZVxyXG5cdFx0cmV0dXJuIHBhdGg7XHJcblx0fVxyXG5cclxuXHJcblx0c3RhdGljIG5vcm1hbGl6ZVBhdGhGb3JMaW5rKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2dpLCBcIi9cIik7IC8vcmVwbGFjZSBcXCB0byAvXHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC8gL2dpLCBcIiUyMFwiKTsgLy9yZXBsYWNlIHNwYWNlIHRvICUyMFxyXG5cdFx0cmV0dXJuIHBhdGg7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbm9ybWFsaXplTGlua1NlY3Rpb24oc2VjdGlvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdHNlY3Rpb24gPSBkZWNvZGVVUkkoc2VjdGlvbik7XHJcblx0XHRyZXR1cm4gc2VjdGlvbjtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBhc3luYyBnZXRDYWNoZVNhZmUoZmlsZU9yUGF0aDogVEZpbGUgfCBzdHJpbmcpIHtcclxuXHRcdGNvbnN0IGZpbGUgPSBVdGlscy5nZXRGaWxlKGZpbGVPclBhdGgpO1xyXG5cclxuXHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xyXG5cdFx0XHRpZiAoY2FjaGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gY2FjaGU7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0YXdhaXQgVXRpbHMuZGVsYXkoMTAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRGaWxlKGZpbGVPclBhdGg6IFRGaWxlIHwgc3RyaW5nKSB7XHJcblx0XHRpZiAoZmlsZU9yUGF0aCBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcblx0XHRcdHJldHVybiBmaWxlT3JQYXRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGFic3RyYWN0RmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZU9yUGF0aCk7XHJcblx0XHRpZiAoIWFic3RyYWN0RmlsZSkge1xyXG5cdFx0XHR0aHJvdyBgRmlsZSAke2ZpbGVPclBhdGh9IGRvZXMgbm90IGV4aXN0YDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShhYnN0cmFjdEZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcclxuXHRcdFx0dGhyb3cgYCR7ZmlsZU9yUGF0aH0gaXMgbm90IGEgZmlsZWA7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGFic3RyYWN0RmlsZTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgcGF0aCB7XHJcbiAgICBzdGF0aWMgam9pbiguLi5wYXJ0czogc3RyaW5nW10pIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuICcuJztcclxuICAgICAgICB2YXIgam9pbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGpvaW5lZCA9IGFyZztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBqb2luZWQgKz0gJy8nICsgYXJnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChqb2luZWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuICcuJztcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpeE5vcm1hbGl6ZShqb2luZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkaXJuYW1lKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcclxuICAgICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xyXG4gICAgICAgIHZhciBlbmQgPSAtMTtcclxuICAgICAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xyXG4gICAgICAgICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcclxuICAgICAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXHJcbiAgICAgICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xyXG4gICAgICAgIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkgcmV0dXJuICcvLyc7XHJcbiAgICAgICAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYmFzZW5hbWUocGF0aDogc3RyaW5nLCBleHQ/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGV4dCAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZXh0XCIgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xyXG5cclxuICAgICAgICB2YXIgc3RhcnQgPSAwO1xyXG4gICAgICAgIHZhciBlbmQgPSAtMTtcclxuICAgICAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcclxuICAgICAgICB2YXIgaTtcclxuXHJcbiAgICAgICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIGV4dC5sZW5ndGggPiAwICYmIGV4dC5sZW5ndGggPD0gcGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKGV4dC5sZW5ndGggPT09IHBhdGgubGVuZ3RoICYmIGV4dCA9PT0gcGF0aCkgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB2YXIgZXh0SWR4ID0gZXh0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIHZhciBmaXJzdE5vblNsYXNoRW5kID0gLTE7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdE5vblNsYXNoRW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgcmVtZW1iZXIgdGhpcyBpbmRleCBpbiBjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgaXQgaWYgdGhlIGV4dGVuc2lvbiBlbmRzIHVwIG5vdCBtYXRjaGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROb25TbGFzaEVuZCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0SWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRvIG1hdGNoIHRoZSBleHBsaWNpdCBleHRlbnNpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IGV4dC5jaGFyQ29kZUF0KGV4dElkeCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgtLWV4dElkeCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBtYXRjaGVkIHRoZSBleHRlbnNpb24sIHNvIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91ciBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBkb2VzIG5vdCBtYXRjaCwgc28gb3VyIHJlc3VsdCBpcyB0aGUgZW50aXJlIHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0SWR4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPT09IGVuZCkgZW5kID0gZmlyc3ROb25TbGFzaEVuZDsgZWxzZSBpZiAoZW5kID09PSAtMSkgZW5kID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVuZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcGF0aCBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBlbmQgPSBpICsgMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRuYW1lKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBzdGFydERvdCA9IC0xO1xyXG4gICAgICAgIHZhciBzdGFydFBhcnQgPSAwO1xyXG4gICAgICAgIHZhciBlbmQgPSAtMTtcclxuICAgICAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcclxuICAgICAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXHJcbiAgICAgICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcclxuICAgICAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXHJcbiAgICAgICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcclxuICAgICAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxyXG4gICAgICAgICAgICAgICAgLy8gZXh0ZW5zaW9uXHJcbiAgICAgICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IGkgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RG90ID0gaTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXHJcbiAgICAgICAgICAgICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxyXG4gICAgICAgICAgICAgICAgcHJlRG90U3RhdGUgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XHJcbiAgICAgICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XHJcbiAgICAgICAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XHJcbiAgICAgICAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcclxuICAgICAgICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBwYXJzZShwYXRoOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIHJldCA9IHsgcm9vdDogJycsIGRpcjogJycsIGJhc2U6ICcnLCBleHQ6ICcnLCBuYW1lOiAnJyB9O1xyXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJldDtcclxuICAgICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB2YXIgaXNBYnNvbHV0ZSA9IGNvZGUgPT09IDQ3IC8qLyovO1xyXG4gICAgICAgIHZhciBzdGFydDtcclxuICAgICAgICBpZiAoaXNBYnNvbHV0ZSkge1xyXG4gICAgICAgICAgICByZXQucm9vdCA9ICcvJztcclxuICAgICAgICAgICAgc3RhcnQgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0YXJ0RG90ID0gLTE7XHJcbiAgICAgICAgdmFyIHN0YXJ0UGFydCA9IDA7XHJcbiAgICAgICAgdmFyIGVuZCA9IC0xO1xyXG4gICAgICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xyXG4gICAgICAgIHZhciBpID0gcGF0aC5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXHJcbiAgICAgICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcclxuICAgICAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xyXG5cclxuICAgICAgICAvLyBHZXQgbm9uLWRpciBpbmZvXHJcbiAgICAgICAgZm9yICg7IGkgPj0gc3RhcnQ7IC0taSkge1xyXG4gICAgICAgICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXHJcbiAgICAgICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcclxuICAgICAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxyXG4gICAgICAgICAgICAgICAgLy8gZXh0ZW5zaW9uXHJcbiAgICAgICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IGkgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKSBzdGFydERvdCA9IGk7IGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKSBwcmVEb3RTdGF0ZSA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxyXG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cclxuICAgICAgICAgICAgICAgIHByZURvdFN0YXRlID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxyXG4gICAgICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxyXG4gICAgICAgICAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxyXG4gICAgICAgICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXHJcbiAgICAgICAgICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XHJcbiAgICAgICAgICAgIGlmIChlbmQgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHJldC5iYXNlID0gcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIGVuZCk7IGVsc2UgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSB7XHJcbiAgICAgICAgICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2UoMSwgc3RhcnREb3QpO1xyXG4gICAgICAgICAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKDEsIGVuZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBzdGFydERvdCk7XHJcbiAgICAgICAgICAgICAgICByZXQuYmFzZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldC5leHQgPSBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0UGFydCA+IDApIHJldC5kaXIgPSBwYXRoLnNsaWNlKDAsIHN0YXJ0UGFydCAtIDEpOyBlbHNlIGlmIChpc0Fic29sdXRlKSByZXQuZGlyID0gJy8nO1xyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBwb3NpeE5vcm1hbGl6ZShwYXRoOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xyXG5cclxuICAgICAgICB2YXIgaXNBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XHJcbiAgICAgICAgdmFyIHRyYWlsaW5nU2VwYXJhdG9yID0gcGF0aC5jaGFyQ29kZUF0KHBhdGgubGVuZ3RoIC0gMSkgPT09IDQ3IC8qLyovO1xyXG5cclxuICAgICAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcclxuICAgICAgICBwYXRoID0gdGhpcy5ub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCAhaXNBYnNvbHV0ZSk7XHJcblxyXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCAmJiAhaXNBYnNvbHV0ZSkgcGF0aCA9ICcuJztcclxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPiAwICYmIHRyYWlsaW5nU2VwYXJhdG9yKSBwYXRoICs9ICcvJztcclxuXHJcbiAgICAgICAgaWYgKGlzQWJzb2x1dGUpIHJldHVybiAnLycgKyBwYXRoO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoOiBzdHJpbmcsIGFsbG93QWJvdmVSb290OiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9ICcnO1xyXG4gICAgICAgIHZhciBsYXN0U2VnbWVudExlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIGxhc3RTbGFzaCA9IC0xO1xyXG4gICAgICAgIHZhciBkb3RzID0gMDtcclxuICAgICAgICB2YXIgY29kZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBwYXRoLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgcGF0aC5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0NyAvKi8qLylcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb2RlID0gNDcgLyovKi87XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RTbGFzaCA9PT0gaSAtIDEgfHwgZG90cyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5PT1BcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNsYXNoICE9PSBpIC0gMSAmJiBkb3RzID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPCAyIHx8IGxhc3RTZWdtZW50TGVuZ3RoICE9PSAyIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAxKSAhPT0gNDYgLyouKi8gfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSA0NiAvKi4qLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0U2xhc2hJbmRleCA9IHJlcy5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ICE9PSByZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuc2xpY2UoMCwgbGFzdFNsYXNoSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90cyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMiB8fCByZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gJy8uLic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9ICcuLic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9ICcvJyArIHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xyXG4gICAgICAgICAgICAgICAgZG90cyA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDYgLyouKi8gJiYgZG90cyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICsrZG90cztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvdHMgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwb3NpeFJlc29sdmUoLi4uYXJnczogc3RyaW5nW10pIHtcclxuICAgICAgICB2YXIgcmVzb2x2ZWRQYXRoID0gJyc7XHJcbiAgICAgICAgdmFyIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgY3dkO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gYXJncy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcclxuICAgICAgICAgICAgdmFyIHBhdGg7XHJcbiAgICAgICAgICAgIGlmIChpID49IDApXHJcbiAgICAgICAgICAgICAgICBwYXRoID0gYXJnc1tpXTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3dkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY3dkID0gcHJvY2Vzcy5jd2QoKTtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBjd2Q7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGVtcHR5IGVudHJpZXNcclxuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcclxuICAgICAgICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XHJcbiAgICAgICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXHJcblxyXG4gICAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxyXG4gICAgICAgIHJlc29sdmVkUGF0aCA9IHRoaXMubm9ybWFsaXplU3RyaW5nUG9zaXgocmVzb2x2ZWRQYXRoLCAhcmVzb2x2ZWRBYnNvbHV0ZSk7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZlZEFic29sdXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiAnLycgKyByZXNvbHZlZFBhdGg7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAnLyc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRQYXRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnLic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWxhdGl2ZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XHJcblxyXG4gICAgICAgIGZyb20gPSB0aGlzLnBvc2l4UmVzb2x2ZShmcm9tKTtcclxuICAgICAgICB0byA9IHRoaXMucG9zaXhSZXNvbHZlKHRvKTtcclxuXHJcbiAgICAgICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XHJcblxyXG4gICAgICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcclxuICAgICAgICB2YXIgZnJvbVN0YXJ0ID0gMTtcclxuICAgICAgICBmb3IgKDsgZnJvbVN0YXJ0IDwgZnJvbS5sZW5ndGg7ICsrZnJvbVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0KSAhPT0gNDcgLyovKi8pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGZyb21FbmQgPSBmcm9tLmxlbmd0aDtcclxuICAgICAgICB2YXIgZnJvbUxlbiA9IGZyb21FbmQgLSBmcm9tU3RhcnQ7XHJcblxyXG4gICAgICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcclxuICAgICAgICB2YXIgdG9TdGFydCA9IDE7XHJcbiAgICAgICAgZm9yICg7IHRvU3RhcnQgPCB0by5sZW5ndGg7ICsrdG9TdGFydCkge1xyXG4gICAgICAgICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0KSAhPT0gNDcgLyovKi8pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRvRW5kID0gdG8ubGVuZ3RoO1xyXG4gICAgICAgIHZhciB0b0xlbiA9IHRvRW5kIC0gdG9TdGFydDtcclxuXHJcbiAgICAgICAgLy8gQ29tcGFyZSBwYXRocyB0byBmaW5kIHRoZSBsb25nZXN0IGNvbW1vbiBwYXRoIGZyb20gcm9vdFxyXG4gICAgICAgIHZhciBsZW5ndGggPSBmcm9tTGVuIDwgdG9MZW4gPyBmcm9tTGVuIDogdG9MZW47XHJcbiAgICAgICAgdmFyIGxhc3RDb21tb25TZXAgPSAtMTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgZm9yICg7IGkgPD0gbGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvTGVuID4gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpID09PSA0NyAvKi8qLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgZnJvbWAgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYHRvYC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyJzsgdG89Jy9mb28vYmFyL2JheidcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgcm9vdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nLyc7IHRvPScvZm9vJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCArIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnJvbUxlbiA+IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYGZyb21gLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvby9iYXIvYmF6JzsgdG89Jy9mb28vYmFyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYHRvYCBpcyB0aGUgcm9vdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28nOyB0bz0nLydcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb21Db2RlID0gZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpO1xyXG4gICAgICAgICAgICB2YXIgdG9Db2RlID0gdG8uY2hhckNvZGVBdCh0b1N0YXJ0ICsgaSk7XHJcbiAgICAgICAgICAgIGlmIChmcm9tQ29kZSAhPT0gdG9Db2RlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGZyb21Db2RlID09PSA0NyAvKi8qLylcclxuICAgICAgICAgICAgICAgIGxhc3RDb21tb25TZXAgPSBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG91dCA9ICcnO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSByZWxhdGl2ZSBwYXRoIGJhc2VkIG9uIHRoZSBwYXRoIGRpZmZlcmVuY2UgYmV0d2VlbiBgdG9gXHJcbiAgICAgICAgLy8gYW5kIGBmcm9tYFxyXG4gICAgICAgIGZvciAoaSA9IGZyb21TdGFydCArIGxhc3RDb21tb25TZXAgKyAxOyBpIDw9IGZyb21FbmQ7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gZnJvbUVuZCB8fCBmcm9tLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJy4uJztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJy8uLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExhc3RseSwgYXBwZW5kIHRoZSByZXN0IG9mIHRoZSBkZXN0aW5hdGlvbiAoYHRvYCkgcGF0aCB0aGF0IGNvbWVzIGFmdGVyXHJcbiAgICAgICAgLy8gdGhlIGNvbW1vbiBwYXRoIHBhcnRzXHJcbiAgICAgICAgaWYgKG91dC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gb3V0ICsgdG8uc2xpY2UodG9TdGFydCArIGxhc3RDb21tb25TZXApO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0b1N0YXJ0ICs9IGxhc3RDb21tb25TZXA7XHJcbiAgICAgICAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpID09PSA0NyAvKi8qLylcclxuICAgICAgICAgICAgICAgICsrdG9TdGFydDtcclxuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEFwcCwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIEVtYmVkQ2FjaGUsIExpbmtDYWNoZSwgUG9zIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBwYXRoIH0gZnJvbSAnLi9wYXRoJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGF0aENoYW5nZUluZm8ge1xyXG5cdG9sZFBhdGg6IHN0cmluZyxcclxuXHRuZXdQYXRoOiBzdHJpbmcsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW1iZWRDaGFuZ2VJbmZvIHtcclxuXHRvbGQ6IEVtYmVkQ2FjaGUsXHJcblx0bmV3TGluazogc3RyaW5nLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpbmtDaGFuZ2VJbmZvIHtcclxuXHRvbGQ6IExpbmtDYWNoZSxcclxuXHRuZXdMaW5rOiBzdHJpbmcsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGlua3NBbmRFbWJlZHNDaGFuZ2VkSW5mbyB7XHJcblx0ZW1iZWRzOiBFbWJlZENoYW5nZUluZm9bXVxyXG5cdGxpbmtzOiBMaW5rQ2hhbmdlSW5mb1tdXHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpbmtTZWN0aW9uSW5mbyB7XHJcblx0aGFzU2VjdGlvbjogYm9vbGVhblxyXG5cdGxpbms6IHN0cmluZ1xyXG5cdHNlY3Rpb246IHN0cmluZ1xyXG59XHJcblxyXG5cclxuLy9zaW1wbGUgcmVnZXhcclxuLy8gY29uc3QgbWFya2Rvd25MaW5rT3JFbWJlZFJlZ2V4U2ltcGxlID0gL1xcWyguKj8pXFxdXFwoKC4qPylcXCkvZ2ltXHJcbi8vIGNvbnN0IG1hcmtkb3duTGlua1JlZ2V4U2ltcGxlID0gLyg/PCFcXCEpXFxbKC4qPylcXF1cXCgoLio/KVxcKS9naW07XHJcbi8vIGNvbnN0IG1hcmtkb3duRW1iZWRSZWdleFNpbXBsZSA9IC9cXCFcXFsoLio/KVxcXVxcKCguKj8pXFwpL2dpbVxyXG5cclxuLy8gY29uc3Qgd2lraUxpbmtPckVtYmVkUmVnZXhTaW1wbGUgPSAvXFxbXFxbKC4qPylcXF1cXF0vZ2ltXHJcbi8vIGNvbnN0IHdpa2lMaW5rUmVnZXhTaW1wbGUgPSAvKD88IVxcISlcXFtcXFsoLio/KVxcXVxcXS9naW07XHJcbi8vIGNvbnN0IHdpa2lFbWJlZFJlZ2V4U2ltcGxlID0gL1xcIVxcW1xcWyguKj8pXFxdXFxdL2dpbVxyXG5cclxuLy93aXRoIGVzY2FwaW5nIFxcIGNoYXJhY3RlcnNcclxuY29uc3QgbWFya2Rvd25MaW5rT3JFbWJlZFJlZ2V4RyA9IC8oPzwhXFxcXClcXFsoLio/KSg/PCFcXFxcKVxcXVxcKCguKj8pKD88IVxcXFwpXFwpL2dpbVxyXG5jb25zdCBtYXJrZG93bkxpbmtSZWdleEcgPSAvKD88IVxcISkoPzwhXFxcXClcXFsoLio/KSg/PCFcXFxcKVxcXVxcKCguKj8pKD88IVxcXFwpKD86IyguKj8pKT9cXCkvZ2ltO1xyXG5jb25zdCBtYXJrZG93bkVtYmVkUmVnZXhHID0gLyg/PCFcXFxcKVxcIVxcWyguKj8pKD88IVxcXFwpXFxdXFwoKC4qPykoPzwhXFxcXClcXCkvZ2ltXHJcblxyXG5jb25zdCB3aWtpTGlua09yRW1iZWRSZWdleEcgPSAvKD88IVxcXFwpXFxbXFxbKC4qPykoPzwhXFxcXClcXF1cXF0vZ2ltXHJcbmNvbnN0IHdpa2lMaW5rUmVnZXhHID0gLyg/PCFcXCEpKD88IVxcXFwpXFxbXFxbKC4qPykoPzwhXFxcXClcXF1cXF0vZ2ltO1xyXG5jb25zdCB3aWtpRW1iZWRSZWdleEcgPSAvKD88IVxcXFwpXFwhXFxbXFxbKC4qPykoPzwhXFxcXClcXF1cXF0vZ2ltXHJcblxyXG5jb25zdCBtYXJrZG93bkxpbmtPckVtYmVkUmVnZXggPSAvKD88IVxcXFwpXFxbKC4qPykoPzwhXFxcXClcXF1cXCgoLio/KSg/PCFcXFxcKVxcKS9pbVxyXG5jb25zdCBtYXJrZG93bkxpbmtSZWdleCA9IC8oPzwhXFwhKSg/PCFcXFxcKVxcWyguKj8pKD88IVxcXFwpXFxdXFwoKC4qPykoPzwhXFxcXClcXCkvaW07XHJcbmNvbnN0IG1hcmtkb3duRW1iZWRSZWdleCA9IC8oPzwhXFxcXClcXCFcXFsoLio/KSg/PCFcXFxcKVxcXVxcKCguKj8pKD88IVxcXFwpXFwpL2ltXHJcblxyXG5jb25zdCB3aWtpTGlua09yRW1iZWRSZWdleCA9IC8oPzwhXFxcXClcXFtcXFsoLio/KSg/PCFcXFxcKVxcXVxcXS9pbVxyXG5jb25zdCB3aWtpTGlua1JlZ2V4ID0gLyg/PCFcXCEpKD88IVxcXFwpXFxbXFxbKC4qPykoPzwhXFxcXClcXF1cXF0vaW07XHJcbmNvbnN0IHdpa2lFbWJlZFJlZ2V4ID0gLyg/PCFcXFxcKVxcIVxcW1xcWyguKj8pKD88IVxcXFwpXFxdXFxdL2ltXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmtzSGFuZGxlciB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0cHJpdmF0ZSBhcHA6IEFwcCxcclxuXHRcdHByaXZhdGUgY29uc29sZUxvZ1ByZWZpeDogc3RyaW5nID0gXCJcIixcclxuXHRcdHByaXZhdGUgaWdub3JlRm9sZGVyczogc3RyaW5nW10gPSBbXSxcclxuXHRcdHByaXZhdGUgaWdub3JlRmlsZXNSZWdleDogUmVnRXhwW10gPSBbXSxcclxuXHQpIHsgfVxyXG5cclxuXHRpc1BhdGhJZ25vcmVkKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHBhdGguc3RhcnRzV2l0aChcIi4vXCIpKVxyXG5cdFx0XHRwYXRoID0gcGF0aC5zdWJzdHJpbmcoMik7XHJcblxyXG5cdFx0Zm9yIChsZXQgZm9sZGVyIG9mIHRoaXMuaWdub3JlRm9sZGVycykge1xyXG5cdFx0XHRpZiAocGF0aC5zdGFydHNXaXRoKGZvbGRlcikpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGZpbGVSZWdleCBvZiB0aGlzLmlnbm9yZUZpbGVzUmVnZXgpIHtcclxuXHRcdFx0aWYgKGZpbGVSZWdleC50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNoZWNrSXNDb3JyZWN0TWFya2Rvd25FbWJlZCh0ZXh0OiBzdHJpbmcpIHtcclxuXHRcdGxldCBlbGVtZW50cyA9IHRleHQubWF0Y2gobWFya2Rvd25FbWJlZFJlZ2V4Ryk7XHJcblx0XHRyZXR1cm4gKGVsZW1lbnRzICE9IG51bGwgJiYgZWxlbWVudHMubGVuZ3RoID4gMClcclxuXHR9XHJcblxyXG5cdGNoZWNrSXNDb3JyZWN0TWFya2Rvd25MaW5rKHRleHQ6IHN0cmluZykge1xyXG5cdFx0bGV0IGVsZW1lbnRzID0gdGV4dC5tYXRjaChtYXJrZG93bkxpbmtSZWdleEcpO1xyXG5cdFx0cmV0dXJuIChlbGVtZW50cyAhPSBudWxsICYmIGVsZW1lbnRzLmxlbmd0aCA+IDApXHJcblx0fVxyXG5cclxuXHRjaGVja0lzQ29ycmVjdE1hcmtkb3duRW1iZWRPckxpbmsodGV4dDogc3RyaW5nKSB7XHJcblx0XHRsZXQgZWxlbWVudHMgPSB0ZXh0Lm1hdGNoKG1hcmtkb3duTGlua09yRW1iZWRSZWdleEcpO1xyXG5cdFx0cmV0dXJuIChlbGVtZW50cyAhPSBudWxsICYmIGVsZW1lbnRzLmxlbmd0aCA+IDApXHJcblx0fVxyXG5cclxuXHRjaGVja0lzQ29ycmVjdFdpa2lFbWJlZCh0ZXh0OiBzdHJpbmcpIHtcclxuXHRcdGxldCBlbGVtZW50cyA9IHRleHQubWF0Y2god2lraUVtYmVkUmVnZXhHKTtcclxuXHRcdHJldHVybiAoZWxlbWVudHMgIT0gbnVsbCAmJiBlbGVtZW50cy5sZW5ndGggPiAwKVxyXG5cdH1cclxuXHJcblx0Y2hlY2tJc0NvcnJlY3RXaWtpTGluayh0ZXh0OiBzdHJpbmcpIHtcclxuXHRcdGxldCBlbGVtZW50cyA9IHRleHQubWF0Y2god2lraUxpbmtSZWdleEcpO1xyXG5cdFx0cmV0dXJuIChlbGVtZW50cyAhPSBudWxsICYmIGVsZW1lbnRzLmxlbmd0aCA+IDApXHJcblx0fVxyXG5cclxuXHRjaGVja0lzQ29ycmVjdFdpa2lFbWJlZE9yTGluayh0ZXh0OiBzdHJpbmcpIHtcclxuXHRcdGxldCBlbGVtZW50cyA9IHRleHQubWF0Y2god2lraUxpbmtPckVtYmVkUmVnZXhHKTtcclxuXHRcdHJldHVybiAoZWxlbWVudHMgIT0gbnVsbCAmJiBlbGVtZW50cy5sZW5ndGggPiAwKVxyXG5cdH1cclxuXHJcblxyXG5cdGdldEZpbGVCeUxpbmsobGluazogc3RyaW5nLCBvd25pbmdOb3RlUGF0aDogc3RyaW5nLCBhbGxvd0ludmFsaWRMaW5rOiBib29sZWFuID0gdHJ1ZSk6IFRGaWxlIHtcclxuXHRcdGxpbmsgPSB0aGlzLnNwbGl0TGlua1RvUGF0aEFuZFNlY3Rpb24obGluaykubGluaztcclxuXHRcdGlmIChhbGxvd0ludmFsaWRMaW5rKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmssIG93bmluZ05vdGVQYXRoKTtcclxuXHRcdH1cclxuXHRcdGxldCBmdWxsUGF0aCA9IHRoaXMuZ2V0RnVsbFBhdGhGb3JMaW5rKGxpbmssIG93bmluZ05vdGVQYXRoKTtcclxuXHRcdHJldHVybiB0aGlzLmdldEZpbGVCeVBhdGgoZnVsbFBhdGgpO1xyXG5cdH1cclxuXHJcblxyXG5cdGdldEZpbGVCeVBhdGgocGF0aDogc3RyaW5nKTogVEZpbGUge1xyXG5cdFx0cGF0aCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JGaWxlKHBhdGgpO1xyXG5cdFx0cmV0dXJuIGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCkgYXMgVEZpbGU7XHJcblx0fVxyXG5cclxuXHJcblx0Z2V0RnVsbFBhdGhGb3JMaW5rKGxpbms6IHN0cmluZywgb3duaW5nTm90ZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRsaW5rID0gdGhpcy5zcGxpdExpbmtUb1BhdGhBbmRTZWN0aW9uKGxpbmspLmxpbms7XHJcblx0XHRsaW5rID0gVXRpbHMubm9ybWFsaXplUGF0aEZvckZpbGUobGluayk7XHJcblx0XHRvd25pbmdOb3RlUGF0aCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JGaWxlKG93bmluZ05vdGVQYXRoKTtcclxuXHJcblx0XHRsZXQgcGFyZW50Rm9sZGVyID0gb3duaW5nTm90ZVBhdGguc3Vic3RyaW5nKDAsIG93bmluZ05vdGVQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSk7XHJcblx0XHRsZXQgZnVsbFBhdGggPSBwYXRoLmpvaW4ocGFyZW50Rm9sZGVyLCBsaW5rKTtcclxuXHJcblx0XHRmdWxsUGF0aCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JGaWxlKGZ1bGxQYXRoKTtcclxuXHRcdHJldHVybiBmdWxsUGF0aDtcclxuXHR9XHJcblxyXG5cclxuXHRhc3luYyBnZXRBbGxDYWNoZWRMaW5rc1RvRmlsZShmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTx7IFtub3RlUGF0aDogc3RyaW5nXTogTGlua0NhY2hlW107IH0+IHtcclxuXHRcdGxldCBhbGxMaW5rczogeyBbbm90ZVBhdGg6IHN0cmluZ106IExpbmtDYWNoZVtdOyB9ID0ge307XHJcblx0XHRsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG5cdFx0aWYgKG5vdGVzKSB7XHJcblx0XHRcdGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuXHRcdFx0XHRpZiAobm90ZS5wYXRoID09IGZpbGVQYXRoKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZS5wYXRoKSkubGlua3M7XHJcblxyXG5cdFx0XHRcdGlmIChsaW5rcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdFx0XHRsZXQgbGlua0Z1bGxQYXRoID0gdGhpcy5nZXRGdWxsUGF0aEZvckxpbmsobGluay5saW5rLCBub3RlLnBhdGgpO1xyXG5cdFx0XHRcdFx0XHRpZiAobGlua0Z1bGxQYXRoID09IGZpbGVQYXRoKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFhbGxMaW5rc1tub3RlLnBhdGhdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWxsTGlua3Nbbm90ZS5wYXRoXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGFsbExpbmtzW25vdGUucGF0aF0ucHVzaChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhbGxMaW5rcztcclxuXHR9XHJcblxyXG5cclxuXHRhc3luYyBnZXRBbGxDYWNoZWRFbWJlZHNUb0ZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8eyBbbm90ZVBhdGg6IHN0cmluZ106IEVtYmVkQ2FjaGVbXTsgfT4ge1xyXG5cdFx0bGV0IGFsbEVtYmVkczogeyBbbm90ZVBhdGg6IHN0cmluZ106IEVtYmVkQ2FjaGVbXTsgfSA9IHt9O1xyXG5cdFx0bGV0IG5vdGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuXHRcdGlmIChub3Rlcykge1xyXG5cdFx0XHRmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcblx0XHRcdFx0aWYgKG5vdGUucGF0aCA9PSBmaWxlUGF0aClcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHQvLyEhISB0aGlzIGNhbiByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdGUgd2FzIGp1c3QgdXBkYXRlZFxyXG5cdFx0XHRcdGxldCBlbWJlZHMgPSAoYXdhaXQgVXRpbHMuZ2V0Q2FjaGVTYWZlKG5vdGUucGF0aCkpLmVtYmVkcztcclxuXHJcblx0XHRcdFx0aWYgKGVtYmVkcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZW1iZWQgb2YgZW1iZWRzKSB7XHJcblx0XHRcdFx0XHRcdGxldCBsaW5rRnVsbFBhdGggPSB0aGlzLmdldEZ1bGxQYXRoRm9yTGluayhlbWJlZC5saW5rLCBub3RlLnBhdGgpO1xyXG5cdFx0XHRcdFx0XHRpZiAobGlua0Z1bGxQYXRoID09IGZpbGVQYXRoKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFhbGxFbWJlZHNbbm90ZS5wYXRoXSlcclxuXHRcdFx0XHRcdFx0XHRcdGFsbEVtYmVkc1tub3RlLnBhdGhdID0gW107XHJcblx0XHRcdFx0XHRcdFx0YWxsRW1iZWRzW25vdGUucGF0aF0ucHVzaChlbWJlZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWxsRW1iZWRzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRhc3luYyBnZXRBbGxCYWRMaW5rcygpOiBQcm9taXNlPHsgW25vdGVQYXRoOiBzdHJpbmddOiBMaW5rQ2FjaGVbXTsgfT4ge1xyXG5cdFx0bGV0IGFsbExpbmtzOiB7IFtub3RlUGF0aDogc3RyaW5nXTogTGlua0NhY2hlW107IH0gPSB7fTtcclxuXHRcdGxldCBub3RlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcblx0XHRpZiAobm90ZXMpIHtcclxuXHRcdFx0Zm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZS5wYXRoKSlcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHQvLyEhISB0aGlzIGNhbiByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdGUgd2FzIGp1c3QgdXBkYXRlZFxyXG5cdFx0XHRcdGxldCBsaW5rcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZS5wYXRoKSkubGlua3M7XHJcblxyXG5cdFx0XHRcdGlmIChsaW5rcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdFx0XHRpZiAobGluay5saW5rLnN0YXJ0c1dpdGgoXCIjXCIpKSAvL2ludGVybmFsIHNlY3Rpb24gbGlua1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpTGluayhsaW5rLm9yaWdpbmFsKSlcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBmaWxlID0gdGhpcy5nZXRGaWxlQnlMaW5rKGxpbmsubGluaywgbm90ZS5wYXRoLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdGlmICghZmlsZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghYWxsTGlua3Nbbm90ZS5wYXRoXSlcclxuXHRcdFx0XHRcdFx0XHRcdGFsbExpbmtzW25vdGUucGF0aF0gPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRhbGxMaW5rc1tub3RlLnBhdGhdLnB1c2gobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWxsTGlua3M7XHJcblx0fVxyXG5cclxuXHRhc3luYyBnZXRBbGxCYWRFbWJlZHMoKTogUHJvbWlzZTx7IFtub3RlUGF0aDogc3RyaW5nXTogRW1iZWRDYWNoZVtdOyB9PiB7XHJcblx0XHRsZXQgYWxsRW1iZWRzOiB7IFtub3RlUGF0aDogc3RyaW5nXTogRW1iZWRDYWNoZVtdOyB9ID0ge307XHJcblx0XHRsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG5cdFx0aWYgKG5vdGVzKSB7XHJcblx0XHRcdGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGUucGF0aCkpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Ly8hISEgdGhpcyBjYW4gcmV0dXJuIHVuZGVmaW5lZCBpZiBub3RlIHdhcyBqdXN0IHVwZGF0ZWRcclxuXHRcdFx0XHRsZXQgZW1iZWRzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlLnBhdGgpKS5lbWJlZHM7XHJcblxyXG5cdFx0XHRcdGlmIChlbWJlZHMpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGVtYmVkIG9mIGVtYmVkcykge1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5jaGVja0lzQ29ycmVjdFdpa2lFbWJlZChlbWJlZC5vcmlnaW5hbCkpXHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgZmlsZSA9IHRoaXMuZ2V0RmlsZUJ5TGluayhlbWJlZC5saW5rLCBub3RlLnBhdGgsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFhbGxFbWJlZHNbbm90ZS5wYXRoXSlcclxuXHRcdFx0XHRcdFx0XHRcdGFsbEVtYmVkc1tub3RlLnBhdGhdID0gW107XHJcblx0XHRcdFx0XHRcdFx0YWxsRW1iZWRzW25vdGUucGF0aF0ucHVzaChlbWJlZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWxsRW1iZWRzO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIGdldEFsbEdvb2RMaW5rcygpOiBQcm9taXNlPHsgW25vdGVQYXRoOiBzdHJpbmddOiBMaW5rQ2FjaGVbXTsgfT4ge1xyXG5cdFx0bGV0IGFsbExpbmtzOiB7IFtub3RlUGF0aDogc3RyaW5nXTogTGlua0NhY2hlW107IH0gPSB7fTtcclxuXHRcdGxldCBub3RlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcblx0XHRpZiAobm90ZXMpIHtcclxuXHRcdFx0Zm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZS5wYXRoKSlcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHQvLyEhISB0aGlzIGNhbiByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdGUgd2FzIGp1c3QgdXBkYXRlZFxyXG5cdFx0XHRcdGxldCBsaW5rcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZS5wYXRoKSkubGlua3M7XHJcblxyXG5cdFx0XHRcdGlmIChsaW5rcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdFx0XHRpZiAobGluay5saW5rLnN0YXJ0c1dpdGgoXCIjXCIpKSAvL2ludGVybmFsIHNlY3Rpb24gbGlua1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpTGluayhsaW5rLm9yaWdpbmFsKSlcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBmaWxlID0gdGhpcy5nZXRGaWxlQnlMaW5rKGxpbmsubGluaywgbm90ZS5wYXRoKTtcclxuXHRcdFx0XHRcdFx0aWYgKGZpbGUpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWFsbExpbmtzW25vdGUucGF0aF0pXHJcblx0XHRcdFx0XHRcdFx0XHRhbGxMaW5rc1tub3RlLnBhdGhdID0gW107XHJcblx0XHRcdFx0XHRcdFx0YWxsTGlua3Nbbm90ZS5wYXRoXS5wdXNoKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGFsbExpbmtzO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgZ2V0QWxsQmFkU2VjdGlvbkxpbmtzKCk6IFByb21pc2U8eyBbbm90ZVBhdGg6IHN0cmluZ106IExpbmtDYWNoZVtdOyB9PiB7XHJcblx0XHRsZXQgYWxsTGlua3M6IHsgW25vdGVQYXRoOiBzdHJpbmddOiBMaW5rQ2FjaGVbXTsgfSA9IHt9O1xyXG5cdFx0bGV0IG5vdGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuXHRcdGlmIChub3Rlcykge1xyXG5cdFx0XHRmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlLnBhdGgpKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdC8vISEhIHRoaXMgY2FuIHJldHVybiB1bmRlZmluZWQgaWYgbm90ZSB3YXMganVzdCB1cGRhdGVkXHJcblx0XHRcdFx0bGV0IGxpbmtzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlLnBhdGgpKS5saW5rcztcclxuXHRcdFx0XHRpZiAobGlua3MpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgbGlua3MpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpTGluayhsaW5rLm9yaWdpbmFsKSlcclxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBsaSA9IHRoaXMuc3BsaXRMaW5rVG9QYXRoQW5kU2VjdGlvbihsaW5rLmxpbmspO1xyXG5cdFx0XHRcdFx0XHRpZiAoIWxpLmhhc1NlY3Rpb24pXHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgZmlsZSA9IHRoaXMuZ2V0RmlsZUJ5TGluayhsaW5rLmxpbmssIG5vdGUucGF0aCwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZmlsZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmaWxlLmV4dGVuc2lvbiA9PT0gXCJwZGZcIiAmJiBsaS5zZWN0aW9uLnN0YXJ0c1dpdGgoXCJwYWdlPVwiKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHNlY3Rpb24gPSBVdGlscy5ub3JtYWxpemVMaW5rU2VjdGlvbihsaS5zZWN0aW9uKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHNlY3Rpb24uc3RhcnRzV2l0aChcIl5cIikpIC8vc2tpcCBeIGxpbmtzXHJcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1sgIUAkJV4mKigpLT1fK1xcXFwvOydcXFtcXF1cXFwiXFx8XFw/LlxcLFxcPFxcPlxcYFxcflxce1xcfV0vZ2ltO1xyXG5cdFx0XHRcdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UocmVnZXgsICcnKTtcclxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uID0gc2VjdGlvbi5yZXBsYWNlKHJlZ2V4LCAnJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghdGV4dC5jb250YWlucyhcIiNcIiArIHNlY3Rpb24pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWFsbExpbmtzW25vdGUucGF0aF0pXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFsbExpbmtzW25vdGUucGF0aF0gPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGFsbExpbmtzW25vdGUucGF0aF0ucHVzaChsaW5rKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWxsTGlua3M7XHJcblx0fVxyXG5cclxuXHRhc3luYyBnZXRBbGxHb29kRW1iZWRzKCk6IFByb21pc2U8eyBbbm90ZVBhdGg6IHN0cmluZ106IEVtYmVkQ2FjaGVbXTsgfT4ge1xyXG5cdFx0bGV0IGFsbEVtYmVkczogeyBbbm90ZVBhdGg6IHN0cmluZ106IEVtYmVkQ2FjaGVbXTsgfSA9IHt9O1xyXG5cdFx0bGV0IG5vdGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuXHRcdGlmIChub3Rlcykge1xyXG5cdFx0XHRmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlLnBhdGgpKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdC8vISEhIHRoaXMgY2FuIHJldHVybiB1bmRlZmluZWQgaWYgbm90ZSB3YXMganVzdCB1cGRhdGVkXHJcblx0XHRcdFx0bGV0IGVtYmVkcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZS5wYXRoKSkuZW1iZWRzO1xyXG5cclxuXHRcdFx0XHRpZiAoZW1iZWRzKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBlbWJlZCBvZiBlbWJlZHMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpRW1iZWQoZW1iZWQub3JpZ2luYWwpKVxyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IGZpbGUgPSB0aGlzLmdldEZpbGVCeUxpbmsoZW1iZWQubGluaywgbm90ZS5wYXRoKTtcclxuXHRcdFx0XHRcdFx0aWYgKGZpbGUpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWFsbEVtYmVkc1tub3RlLnBhdGhdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWxsRW1iZWRzW25vdGUucGF0aF0gPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRhbGxFbWJlZHNbbm90ZS5wYXRoXS5wdXNoKGVtYmVkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhbGxFbWJlZHM7XHJcblx0fVxyXG5cclxuXHRhc3luYyBnZXRBbGxXaWtpTGlua3MoKTogUHJvbWlzZTx7IFtub3RlUGF0aDogc3RyaW5nXTogTGlua0NhY2hlW107IH0+IHtcclxuXHRcdGxldCBhbGxMaW5rczogeyBbbm90ZVBhdGg6IHN0cmluZ106IExpbmtDYWNoZVtdOyB9ID0ge307XHJcblx0XHRsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG5cdFx0aWYgKG5vdGVzKSB7XHJcblx0XHRcdGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGUucGF0aCkpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Ly8hISEgdGhpcyBjYW4gcmV0dXJuIHVuZGVmaW5lZCBpZiBub3RlIHdhcyBqdXN0IHVwZGF0ZWRcclxuXHRcdFx0XHRsZXQgbGlua3MgPSAoYXdhaXQgVXRpbHMuZ2V0Q2FjaGVTYWZlKG5vdGUucGF0aCkpLmxpbmtzO1xyXG5cclxuXHRcdFx0XHRpZiAobGlua3MpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgbGlua3MpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmNoZWNrSXNDb3JyZWN0V2lraUxpbmsobGluay5vcmlnaW5hbCkpXHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIWFsbExpbmtzW25vdGUucGF0aF0pXHJcblx0XHRcdFx0XHRcdFx0YWxsTGlua3Nbbm90ZS5wYXRoXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRhbGxMaW5rc1tub3RlLnBhdGhdLnB1c2gobGluayk7XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhbGxMaW5rcztcclxuXHR9XHJcblxyXG5cdGFzeW5jIGdldEFsbFdpa2lFbWJlZHMoKTogUHJvbWlzZTx7IFtub3RlUGF0aDogc3RyaW5nXTogRW1iZWRDYWNoZVtdOyB9PiB7XHJcblx0XHRsZXQgYWxsRW1iZWRzOiB7IFtub3RlUGF0aDogc3RyaW5nXTogRW1iZWRDYWNoZVtdOyB9ID0ge307XHJcblx0XHRsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG5cdFx0aWYgKG5vdGVzKSB7XHJcblx0XHRcdGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGUucGF0aCkpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Ly8hISEgdGhpcyBjYW4gcmV0dXJuIHVuZGVmaW5lZCBpZiBub3RlIHdhcyBqdXN0IHVwZGF0ZWRcclxuXHRcdFx0XHRsZXQgZW1iZWRzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlLnBhdGgpKS5lbWJlZHM7XHJcblxyXG5cdFx0XHRcdGlmIChlbWJlZHMpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGVtYmVkIG9mIGVtYmVkcykge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpRW1iZWQoZW1iZWQub3JpZ2luYWwpKVxyXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCFhbGxFbWJlZHNbbm90ZS5wYXRoXSlcclxuXHRcdFx0XHRcdFx0XHRhbGxFbWJlZHNbbm90ZS5wYXRoXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRhbGxFbWJlZHNbbm90ZS5wYXRoXS5wdXNoKGVtYmVkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWxsRW1iZWRzO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUxpbmtzVG9SZW5hbWVkRmlsZShvbGROb3RlUGF0aDogc3RyaW5nLCBuZXdOb3RlUGF0aDogc3RyaW5nLCBjaGFuZ2VsaW5rc0FsdCA9IGZhbHNlLCB1c2VCdWlsdEluT2JzaWRpYW5MaW5rQ2FjaGluZyA9IGZhbHNlKSB7XHJcblx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG9sZE5vdGVQYXRoKSB8fCB0aGlzLmlzUGF0aElnbm9yZWQobmV3Tm90ZVBhdGgpKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0bGV0IG5vdGVzID0gdXNlQnVpbHRJbk9ic2lkaWFuTGlua0NhY2hpbmcgPyBhd2FpdCB0aGlzLmdldENhY2hlZE5vdGVzVGhhdEhhdmVMaW5rVG9GaWxlKG9sZE5vdGVQYXRoKSA6IGF3YWl0IHRoaXMuZ2V0Tm90ZXNUaGF0SGF2ZUxpbmtUb0ZpbGUob2xkTm90ZVBhdGgpO1xyXG5cdFx0bGV0IGxpbmtzOiBQYXRoQ2hhbmdlSW5mb1tdID0gW3sgb2xkUGF0aDogb2xkTm90ZVBhdGgsIG5ld1BhdGg6IG5ld05vdGVQYXRoIH1dO1xyXG5cclxuXHRcdGlmIChub3Rlcykge1xyXG5cdFx0XHRmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy51cGRhdGVDaGFuZ2VkUGF0aHNJbk5vdGUobm90ZSwgbGlua3MsIGNoYW5nZWxpbmtzQWx0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUNoYW5nZWRQYXRoSW5Ob3RlKG5vdGVQYXRoOiBzdHJpbmcsIG9sZExpbms6IHN0cmluZywgbmV3TGluazogc3RyaW5nLCBjaGFuZ2VsaW5rc0FsdCA9IGZhbHNlKSB7XHJcblx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGVQYXRoKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGxldCBjaGFuZ2VzOiBQYXRoQ2hhbmdlSW5mb1tdID0gW3sgb2xkUGF0aDogb2xkTGluaywgbmV3UGF0aDogbmV3TGluayB9XTtcclxuXHRcdHJldHVybiBhd2FpdCB0aGlzLnVwZGF0ZUNoYW5nZWRQYXRoc0luTm90ZShub3RlUGF0aCwgY2hhbmdlcywgY2hhbmdlbGlua3NBbHQpO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUNoYW5nZWRQYXRoc0luTm90ZShub3RlUGF0aDogc3RyaW5nLCBjaGFuZ2VkTGlua3M6IFBhdGhDaGFuZ2VJbmZvW10sIGNoYW5nZWxpbmtzQWx0ID0gZmFsc2UpIHtcclxuXHRcdGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZVBhdGgpKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0bGV0IGZpbGUgPSB0aGlzLmdldEZpbGVCeVBhdGgobm90ZVBhdGgpO1xyXG5cdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJjYW50IHVwZGF0ZSBsaW5rcyBpbiBub3RlLCBmaWxlIG5vdCBmb3VuZDogXCIgKyBub3RlUGF0aCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XHJcblx0XHRsZXQgZGlydHkgPSBmYWxzZTtcclxuXHJcblx0XHRsZXQgZWxlbWVudHMgPSB0ZXh0Lm1hdGNoKG1hcmtkb3duTGlua09yRW1iZWRSZWdleEcpO1xyXG5cdFx0aWYgKGVsZW1lbnRzICE9IG51bGwgJiYgZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3IgKGxldCBlbCBvZiBlbGVtZW50cykge1xyXG5cdFx0XHRcdGxldCBhbHQgPSBlbC5tYXRjaChtYXJrZG93bkxpbmtPckVtYmVkUmVnZXgpWzFdO1xyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwubWF0Y2gobWFya2Rvd25MaW5rT3JFbWJlZFJlZ2V4KVsyXTtcclxuXHRcdFx0XHRsZXQgbGkgPSB0aGlzLnNwbGl0TGlua1RvUGF0aEFuZFNlY3Rpb24obGluayk7XHJcblxyXG5cdFx0XHRcdGlmIChsaS5oYXNTZWN0aW9uKSAgLy8gZm9yIGxpbmtzIHdpdGggc2VjdGlvbnMgbGlrZSBbXShub3RlLm1kI3NlY3Rpb24pXHJcblx0XHRcdFx0XHRsaW5rID0gbGkubGluaztcclxuXHJcblx0XHRcdFx0bGV0IGZ1bGxMaW5rID0gdGhpcy5nZXRGdWxsUGF0aEZvckxpbmsobGluaywgbm90ZVBhdGgpO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBjaGFuZ2VkTGluayBvZiBjaGFuZ2VkTGlua3MpIHtcclxuXHRcdFx0XHRcdGlmIChmdWxsTGluayA9PSBjaGFuZ2VkTGluay5vbGRQYXRoKSB7XHJcblx0XHRcdFx0XHRcdGxldCBuZXdSZWxMaW5rOiBzdHJpbmcgPSBwYXRoLnJlbGF0aXZlKG5vdGVQYXRoLCBjaGFuZ2VkTGluay5uZXdQYXRoKTtcclxuXHRcdFx0XHRcdFx0bmV3UmVsTGluayA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JMaW5rKG5ld1JlbExpbmspO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKG5ld1JlbExpbmsuc3RhcnRzV2l0aChcIi4uL1wiKSkge1xyXG5cdFx0XHRcdFx0XHRcdG5ld1JlbExpbmsgPSBuZXdSZWxMaW5rLnN1YnN0cmluZygzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZWxpbmtzQWx0ICYmIG5ld1JlbExpbmsuZW5kc1dpdGgoXCIubWRcIikpIHtcclxuXHRcdFx0XHRcdFx0XHQvL3JlbmFtZSBvbmx5IGlmIG9sZCBhbHQgPT0gb2xkIG5vdGUgbmFtZVxyXG5cdFx0XHRcdFx0XHRcdGlmIChhbHQgPT09IHBhdGguYmFzZW5hbWUoY2hhbmdlZExpbmsub2xkUGF0aCwgcGF0aC5leHRuYW1lKGNoYW5nZWRMaW5rLm9sZFBhdGgpKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGV4dCA9IHBhdGguZXh0bmFtZShuZXdSZWxMaW5rKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBiYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUobmV3UmVsTGluaywgZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRcdGFsdCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JGaWxlKGJhc2VOYW1lKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChsaS5oYXNTZWN0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoZWwsICdbJyArIGFsdCArICddJyArICcoJyArIG5ld1JlbExpbmsgKyAnIycgKyBsaS5zZWN0aW9uICsgJyknKTtcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoZWwsICdbJyArIGFsdCArICddJyArICcoJyArIG5ld1JlbExpbmsgKyAnKScpO1xyXG5cclxuXHRcdFx0XHRcdFx0ZGlydHkgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJsaW5rIHVwZGF0ZWQgaW4gY2FjaGVkIG5vdGUgW25vdGUsIG9sZCBsaW5rLCBuZXcgbGlua106IFxcbiAgIFwiXHJcblx0XHRcdFx0XHRcdFx0KyBmaWxlLnBhdGggKyBcIlxcbiAgIFwiICsgbGluayArIFwiXFxuICAgXCIgKyBuZXdSZWxMaW5rKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJ0eSlcclxuXHRcdFx0YXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIHRleHQpO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUludGVybmFsTGlua3NJbk1vdmVkTm90ZShvbGROb3RlUGF0aDogc3RyaW5nLCBuZXdOb3RlUGF0aDogc3RyaW5nLCBhdHRhY2htZW50c0FscmVhZHlNb3ZlZDogYm9vbGVhbikge1xyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChvbGROb3RlUGF0aCkgfHwgdGhpcy5pc1BhdGhJZ25vcmVkKG5ld05vdGVQYXRoKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGxldCBmaWxlID0gdGhpcy5nZXRGaWxlQnlQYXRoKG5ld05vdGVQYXRoKTtcclxuXHRcdGlmICghZmlsZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiY2FuJ3QgdXBkYXRlIGludGVybmFsIGxpbmtzLCBmaWxlIG5vdCBmb3VuZDogXCIgKyBuZXdOb3RlUGF0aCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XHJcblx0XHRsZXQgZGlydHkgPSBmYWxzZTtcclxuXHJcblx0XHRsZXQgZWxlbWVudHMgPSB0ZXh0Lm1hdGNoKG1hcmtkb3duTGlua09yRW1iZWRSZWdleEcpO1xyXG5cdFx0aWYgKGVsZW1lbnRzICE9IG51bGwgJiYgZWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3IgKGxldCBlbCBvZiBlbGVtZW50cykge1xyXG5cdFx0XHRcdGxldCBhbHQgPSBlbC5tYXRjaChtYXJrZG93bkxpbmtPckVtYmVkUmVnZXgpWzFdO1xyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwubWF0Y2gobWFya2Rvd25MaW5rT3JFbWJlZFJlZ2V4KVsyXTtcclxuXHRcdFx0XHRsZXQgbGkgPSB0aGlzLnNwbGl0TGlua1RvUGF0aEFuZFNlY3Rpb24obGluayk7XHJcblxyXG5cdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoXCIjXCIpKSAvL2ludGVybmFsIHNlY3Rpb24gbGlua1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdGlmIChsaS5oYXNTZWN0aW9uKSAgLy8gZm9yIGxpbmtzIHdpdGggc2VjdGlvbnMgbGlrZSBbXShub3RlLm1kI3NlY3Rpb24pXHJcblx0XHRcdFx0XHRsaW5rID0gbGkubGluaztcclxuXHJcblxyXG5cdFx0XHRcdC8vc3RhcnRzV2l0aChcIi4uL1wiKSAtIGZvciBub3Qgc2tpcHBpbmcgZmlsZXMgdGhhdCBub3QgaW4gdGhlIG5vdGUgZGlyXHJcblx0XHRcdFx0aWYgKGF0dGFjaG1lbnRzQWxyZWFkeU1vdmVkICYmICFsaW5rLmVuZHNXaXRoKFwiLm1kXCIpICYmICFsaW5rLnN0YXJ0c1dpdGgoXCIuLi9cIikpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0bGV0IGZpbGUgPSB0aGlzLmdldEZpbGVCeUxpbmsobGluaywgb2xkTm90ZVBhdGgpO1xyXG5cdFx0XHRcdGlmICghZmlsZSkge1xyXG5cdFx0XHRcdFx0ZmlsZSA9IHRoaXMuZ2V0RmlsZUJ5TGluayhsaW5rLCBuZXdOb3RlUGF0aCk7XHJcblx0XHRcdFx0XHRpZiAoIWZpbGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcih0aGlzLmNvbnNvbGVMb2dQcmVmaXggKyBuZXdOb3RlUGF0aCArIFwiIGhhcyBiYWQgbGluayAoZmlsZSBkb2VzIG5vdCBleGlzdCk6IFwiICsgbGluayk7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdGxldCBuZXdSZWxMaW5rOiBzdHJpbmcgPSBwYXRoLnJlbGF0aXZlKG5ld05vdGVQYXRoLCBmaWxlLnBhdGgpO1xyXG5cdFx0XHRcdG5ld1JlbExpbmsgPSBVdGlscy5ub3JtYWxpemVQYXRoRm9yTGluayhuZXdSZWxMaW5rKTtcclxuXHJcblx0XHRcdFx0aWYgKG5ld1JlbExpbmsuc3RhcnRzV2l0aChcIi4uL1wiKSkge1xyXG5cdFx0XHRcdFx0bmV3UmVsTGluayA9IG5ld1JlbExpbmsuc3Vic3RyaW5nKDMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGxpLmhhc1NlY3Rpb24pXHJcblx0XHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKGVsLCAnWycgKyBhbHQgKyAnXScgKyAnKCcgKyBuZXdSZWxMaW5rICsgJyMnICsgbGkuc2VjdGlvbiArICcpJyk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShlbCwgJ1snICsgYWx0ICsgJ10nICsgJygnICsgbmV3UmVsTGluayArICcpJyk7XHJcblxyXG5cdFx0XHRcdGRpcnR5ID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJsaW5rIHVwZGF0ZWQgaW4gbW92ZWQgbm90ZSBbbm90ZSwgb2xkIGxpbmssIG5ldyBsaW5rXTogXFxuICAgXCJcclxuXHRcdFx0XHRcdCsgZmlsZS5wYXRoICsgXCJcXG4gICBcIiArIGxpbmsgKyBcIiAgIFxcblwiICsgbmV3UmVsTGluayk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlydHkpXHJcblx0XHRcdGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCB0ZXh0KTtcclxuXHR9XHJcblxyXG5cclxuXHRhc3luYyBnZXRDYWNoZWROb3Rlc1RoYXRIYXZlTGlua1RvRmlsZShmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG5cdFx0bGV0IG5vdGVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0bGV0IGFsbE5vdGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuXHRcdGlmIChhbGxOb3Rlcykge1xyXG5cdFx0XHRmb3IgKGxldCBub3RlIG9mIGFsbE5vdGVzKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlLnBhdGgpKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdGxldCBub3RlUGF0aCA9IG5vdGUucGF0aDtcclxuXHRcdFx0XHRpZiAobm90ZS5wYXRoID09IGZpbGVQYXRoKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdC8vISEhIHRoaXMgY2FuIHJldHVybiB1bmRlZmluZWQgaWYgbm90ZSB3YXMganVzdCB1cGRhdGVkXHJcblx0XHRcdFx0bGV0IGVtYmVkcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZVBhdGgpKS5lbWJlZHM7XHJcblx0XHRcdFx0aWYgKGVtYmVkcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZW1iZWQgb2YgZW1iZWRzKSB7XHJcblx0XHRcdFx0XHRcdGxldCBsaW5rUGF0aCA9IHRoaXMuZ2V0RnVsbFBhdGhGb3JMaW5rKGVtYmVkLmxpbmssIG5vdGUucGF0aCk7XHJcblx0XHRcdFx0XHRcdGlmIChsaW5rUGF0aCA9PSBmaWxlUGF0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghbm90ZXMuY29udGFpbnMobm90ZVBhdGgpKVxyXG5cdFx0XHRcdFx0XHRcdFx0bm90ZXMucHVzaChub3RlUGF0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vISEhIHRoaXMgY2FuIHJldHVybiB1bmRlZmluZWQgaWYgbm90ZSB3YXMganVzdCB1cGRhdGVkXHJcblx0XHRcdFx0bGV0IGxpbmtzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlUGF0aCkpLmxpbmtzO1xyXG5cdFx0XHRcdGlmIChsaW5rcykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdFx0XHRsZXQgbGlua1BhdGggPSB0aGlzLmdldEZ1bGxQYXRoRm9yTGluayhsaW5rLmxpbmssIG5vdGUucGF0aCk7XHJcblx0XHRcdFx0XHRcdGlmIChsaW5rUGF0aCA9PSBmaWxlUGF0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghbm90ZXMuY29udGFpbnMobm90ZVBhdGgpKVxyXG5cdFx0XHRcdFx0XHRcdFx0bm90ZXMucHVzaChub3RlUGF0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbm90ZXM7XHJcblx0fVxyXG5cclxuXHJcblx0YXN5bmMgZ2V0Tm90ZXNUaGF0SGF2ZUxpbmtUb0ZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcclxuXHRcdGxldCBub3Rlczogc3RyaW5nW10gPSBbXTtcclxuXHRcdGxldCBhbGxOb3RlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcblx0XHRpZiAoYWxsTm90ZXMpIHtcclxuXHRcdFx0Zm9yIChsZXQgbm90ZSBvZiBhbGxOb3Rlcykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZS5wYXRoKSlcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRsZXQgbm90ZVBhdGggPSBub3RlLnBhdGg7XHJcblx0XHRcdFx0aWYgKG5vdGVQYXRoID09IGZpbGVQYXRoKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rcyA9IGF3YWl0IHRoaXMuZ2V0TGlua3NGcm9tTm90ZShub3RlUGF0aCk7XHJcblx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdFx0bGV0IGxpID0gdGhpcy5zcGxpdExpbmtUb1BhdGhBbmRTZWN0aW9uKGxpbmsubGluayk7XHJcblx0XHRcdFx0XHRsZXQgbGlua0Z1bGxQYXRoID0gdGhpcy5nZXRGdWxsUGF0aEZvckxpbmsobGkubGluaywgbm90ZVBhdGgpO1xyXG5cdFx0XHRcdFx0aWYgKGxpbmtGdWxsUGF0aCA9PSBmaWxlUGF0aCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIW5vdGVzLmNvbnRhaW5zKG5vdGVQYXRoKSlcclxuXHRcdFx0XHRcdFx0XHRub3Rlcy5wdXNoKG5vdGVQYXRoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbm90ZXM7XHJcblx0fVxyXG5cclxuXHRzcGxpdExpbmtUb1BhdGhBbmRTZWN0aW9uKGxpbms6IHN0cmluZyk6IExpbmtTZWN0aW9uSW5mbyB7XHJcblx0XHRsZXQgcmVzOiBMaW5rU2VjdGlvbkluZm8gPSB7XHJcblx0XHRcdGhhc1NlY3Rpb246IGZhbHNlLFxyXG5cdFx0XHRsaW5rOiBsaW5rLFxyXG5cdFx0XHRzZWN0aW9uOiBcIlwiXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFsaW5rLmNvbnRhaW5zKCcjJykpXHJcblx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cclxuXHRcdGxldCBsaW5rQmVmb3JlSGFzaCA9IGxpbmsubWF0Y2goLyguKj8pIyguKj8pJC8pWzFdO1xyXG5cdFx0bGV0IHNlY3Rpb24gPSBsaW5rLm1hdGNoKC8oLio/KSMoLio/KSQvKVsyXTtcclxuXHJcblx0XHRsZXQgaXNNYXJrZG93blNlY3Rpb24gPSBzZWN0aW9uICE9IFwiXCIgJiYgbGlua0JlZm9yZUhhc2guZW5kc1dpdGgoXCIubWRcIik7IC8vIGZvciBsaW5rcyB3aXRoIHNlY3Rpb25zIGxpa2UgW10obm90ZS5tZCNzZWN0aW9uKVxyXG5cdFx0bGV0IGlzUGRmUGFnZVNlY3Rpb24gPSBzZWN0aW9uLnN0YXJ0c1dpdGgoXCJwYWdlPVwiKSAmJiBsaW5rQmVmb3JlSGFzaC5lbmRzV2l0aChcIi5wZGZcIik7IC8vIGZvciBsaW5rcyB3aXRoIHNlY3Rpb25zIGxpa2UgW10obm90ZS5wZGYjcGFnZT00MilcclxuXHJcblx0XHRpZiAoaXNNYXJrZG93blNlY3Rpb24gfHwgaXNQZGZQYWdlU2VjdGlvbikge1xyXG5cdFx0XHRyZXMgPSB7XHJcblx0XHRcdFx0aGFzU2VjdGlvbjogdHJ1ZSxcclxuXHRcdFx0XHRsaW5rOiBsaW5rQmVmb3JlSGFzaCxcclxuXHRcdFx0XHRzZWN0aW9uOiBzZWN0aW9uXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxuXHJcblxyXG5cdGdldEZpbGVQYXRoV2l0aFJlbmFtZWRCYXNlTmFtZShmaWxlUGF0aDogc3RyaW5nLCBuZXdCYXNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBVdGlscy5ub3JtYWxpemVQYXRoRm9yRmlsZShwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgbmV3QmFzZU5hbWUgKyBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKSk7XHJcblx0fVxyXG5cclxuXHJcblx0YXN5bmMgZ2V0TGlua3NGcm9tTm90ZShub3RlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxMaW5rQ2FjaGVbXT4ge1xyXG5cdFx0bGV0IGZpbGUgPSB0aGlzLmdldEZpbGVCeVBhdGgobm90ZVBhdGgpO1xyXG5cdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJjYW4ndCBnZXQgZW1iZWRzLCBmaWxlIG5vdCBmb3VuZDogXCIgKyBub3RlUGF0aCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XHJcblxyXG5cdFx0bGV0IGxpbmtzOiBMaW5rQ2FjaGVbXSA9IFtdO1xyXG5cclxuXHRcdGxldCBlbGVtZW50cyA9IHRleHQubWF0Y2gobWFya2Rvd25MaW5rT3JFbWJlZFJlZ2V4Ryk7XHJcblx0XHRpZiAoZWxlbWVudHMgIT0gbnVsbCAmJiBlbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAobGV0IGVsIG9mIGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0bGV0IGFsdCA9IGVsLm1hdGNoKG1hcmtkb3duTGlua09yRW1iZWRSZWdleClbMV07XHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbC5tYXRjaChtYXJrZG93bkxpbmtPckVtYmVkUmVnZXgpWzJdO1xyXG5cclxuXHRcdFx0XHRsZXQgZW1iOiBMaW5rQ2FjaGUgPSB7XHJcblx0XHRcdFx0XHRsaW5rOiBsaW5rLFxyXG5cdFx0XHRcdFx0ZGlzcGxheVRleHQ6IGFsdCxcclxuXHRcdFx0XHRcdG9yaWdpbmFsOiBlbCxcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHN0YXJ0OiB7XHJcblx0XHRcdFx0XHRcdFx0Y29sOiAwLC8vdG9kb1xyXG5cdFx0XHRcdFx0XHRcdGxpbmU6IDAsXHJcblx0XHRcdFx0XHRcdFx0b2Zmc2V0OiAwXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdGVuZDoge1xyXG5cdFx0XHRcdFx0XHRcdGNvbDogMCwvL3RvZG9cclxuXHRcdFx0XHRcdFx0XHRsaW5lOiAwLFxyXG5cdFx0XHRcdFx0XHRcdG9mZnNldDogMFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0bGlua3MucHVzaChlbWIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGlua3M7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRhc3luYyBjb252ZXJ0QWxsTm90ZUVtYmVkc1BhdGhzVG9SZWxhdGl2ZShub3RlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxFbWJlZENoYW5nZUluZm9bXT4ge1xyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlUGF0aCkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRsZXQgY2hhbmdlZEVtYmVkczogRW1iZWRDaGFuZ2VJbmZvW10gPSBbXTtcclxuXHJcblx0XHRsZXQgZW1iZWRzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlUGF0aCkpLmVtYmVkcztcclxuXHJcblx0XHRpZiAoZW1iZWRzKSB7XHJcblx0XHRcdGZvciAobGV0IGVtYmVkIG9mIGVtYmVkcykge1xyXG5cdFx0XHRcdGxldCBpc01hcmtkb3duRW1iZWQgPSB0aGlzLmNoZWNrSXNDb3JyZWN0TWFya2Rvd25FbWJlZChlbWJlZC5vcmlnaW5hbCk7XHJcblx0XHRcdFx0bGV0IGlzV2lraUVtYmVkID0gdGhpcy5jaGVja0lzQ29ycmVjdFdpa2lFbWJlZChlbWJlZC5vcmlnaW5hbCk7XHJcblx0XHRcdFx0aWYgKGlzTWFya2Rvd25FbWJlZCB8fCBpc1dpa2lFbWJlZCkge1xyXG5cdFx0XHRcdFx0bGV0IGZpbGUgPSB0aGlzLmdldEZpbGVCeUxpbmsoZW1iZWQubGluaywgbm90ZVBhdGgpO1xyXG5cdFx0XHRcdFx0aWYgKGZpbGUpXHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGVtYmVkLmxpbmssIG5vdGVQYXRoKTtcclxuXHRcdFx0XHRcdGlmIChmaWxlKSB7XHJcblx0XHRcdFx0XHRcdGxldCBuZXdSZWxMaW5rOiBzdHJpbmcgPSBwYXRoLnJlbGF0aXZlKG5vdGVQYXRoLCBmaWxlLnBhdGgpO1xyXG5cdFx0XHRcdFx0XHRuZXdSZWxMaW5rID0gaXNNYXJrZG93bkVtYmVkID8gVXRpbHMubm9ybWFsaXplUGF0aEZvckxpbmsobmV3UmVsTGluaykgOiBVdGlscy5ub3JtYWxpemVQYXRoRm9yRmlsZShuZXdSZWxMaW5rKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChuZXdSZWxMaW5rLnN0YXJ0c1dpdGgoXCIuLi9cIikpIHtcclxuXHRcdFx0XHRcdFx0XHRuZXdSZWxMaW5rID0gbmV3UmVsTGluay5zdWJzdHJpbmcoMyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNoYW5nZWRFbWJlZHMucHVzaCh7IG9sZDogZW1iZWQsIG5ld0xpbms6IG5ld1JlbExpbmsgfSlcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5jb25zb2xlTG9nUHJlZml4ICsgbm90ZVBhdGggKyBcIiBoYXMgYmFkIGVtYmVkIChmaWxlIGRvZXMgbm90IGV4aXN0KTogXCIgKyBlbWJlZC5saW5rKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcih0aGlzLmNvbnNvbGVMb2dQcmVmaXggKyBub3RlUGF0aCArIFwiIGhhcyBiYWQgZW1iZWQgKGZvcm1hdCBvZiBsaW5rIGlzIG5vdCBtYXJrZG93biBvciB3aWtpIGxpbmspOiBcIiArIGVtYmVkLm9yaWdpbmFsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRhd2FpdCB0aGlzLnVwZGF0ZUNoYW5nZWRFbWJlZEluTm90ZShub3RlUGF0aCwgY2hhbmdlZEVtYmVkcyk7XHJcblx0XHRyZXR1cm4gY2hhbmdlZEVtYmVkcztcclxuXHR9XHJcblxyXG5cclxuXHRhc3luYyBjb252ZXJ0QWxsTm90ZUxpbmtzUGF0aHNUb1JlbGF0aXZlKG5vdGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPExpbmtDaGFuZ2VJbmZvW10+IHtcclxuXHRcdGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZVBhdGgpKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0bGV0IGNoYW5nZWRMaW5rczogTGlua0NoYW5nZUluZm9bXSA9IFtdO1xyXG5cclxuXHRcdGxldCBsaW5rcyA9IChhd2FpdCBVdGlscy5nZXRDYWNoZVNhZmUobm90ZVBhdGgpKS5saW5rcztcclxuXHJcblx0XHRpZiAobGlua3MpIHtcclxuXHRcdFx0Zm9yIChsZXQgbGluayBvZiBsaW5rcykge1xyXG5cdFx0XHRcdGxldCBpc01hcmtkb3duTGluayA9IHRoaXMuY2hlY2tJc0NvcnJlY3RNYXJrZG93bkxpbmsobGluay5vcmlnaW5hbCk7XHJcblx0XHRcdFx0bGV0IGlzV2lraUxpbmsgPSB0aGlzLmNoZWNrSXNDb3JyZWN0V2lraUxpbmsobGluay5vcmlnaW5hbCk7XHJcblx0XHRcdFx0aWYgKGlzTWFya2Rvd25MaW5rIHx8IGlzV2lraUxpbmspIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLmxpbmsuc3RhcnRzV2l0aChcIiNcIikpIC8vaW50ZXJuYWwgc2VjdGlvbiBsaW5rXHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGxldCBmaWxlID0gdGhpcy5nZXRGaWxlQnlMaW5rKGxpbmsubGluaywgbm90ZVBhdGgpO1xyXG5cdFx0XHRcdFx0aWYgKGZpbGUpXHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdC8vISEhIGxpbmsuZGlzcGxheVRleHQgaXMgYWx3YXlzIFwiXCIgLSBPQlNJRElBTiBCVUc/LCBzbyBnZXQgZGlzcGxheSB0ZXh0IG1hbnVhbHlcclxuXHRcdFx0XHRcdGlmIChpc01hcmtkb3duTGluaykge1xyXG5cdFx0XHRcdFx0XHRsZXQgZWxlbWVudHMgPSBsaW5rLm9yaWdpbmFsLm1hdGNoKG1hcmtkb3duTGlua1JlZ2V4KTtcclxuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnRzKVxyXG5cdFx0XHRcdFx0XHRcdGxpbmsuZGlzcGxheVRleHQgPSBlbGVtZW50c1sxXTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRmaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChsaW5rLmxpbmssIG5vdGVQYXRoKTtcclxuXHRcdFx0XHRcdGlmIChmaWxlKSB7XHJcblx0XHRcdFx0XHRcdGxldCBuZXdSZWxMaW5rOiBzdHJpbmcgPSBwYXRoLnJlbGF0aXZlKG5vdGVQYXRoLCBmaWxlLnBhdGgpO1xyXG5cdFx0XHRcdFx0XHRuZXdSZWxMaW5rID0gaXNNYXJrZG93bkxpbmsgPyBVdGlscy5ub3JtYWxpemVQYXRoRm9yTGluayhuZXdSZWxMaW5rKSA6IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JGaWxlKG5ld1JlbExpbmspO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKG5ld1JlbExpbmsuc3RhcnRzV2l0aChcIi4uL1wiKSkge1xyXG5cdFx0XHRcdFx0XHRcdG5ld1JlbExpbmsgPSBuZXdSZWxMaW5rLnN1YnN0cmluZygzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Y2hhbmdlZExpbmtzLnB1c2goeyBvbGQ6IGxpbmssIG5ld0xpbms6IG5ld1JlbExpbmsgfSlcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5jb25zb2xlTG9nUHJlZml4ICsgbm90ZVBhdGggKyBcIiBoYXMgYmFkIGxpbmsgKGZpbGUgZG9lcyBub3QgZXhpc3QpOiBcIiArIGxpbmsubGluayk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5jb25zb2xlTG9nUHJlZml4ICsgbm90ZVBhdGggKyBcIiBoYXMgYmFkIGxpbmsgKGZvcm1hdCBvZiBsaW5rIGlzIG5vdCBtYXJrZG93biBvciB3aWtpIGxpbmspOiBcIiArIGxpbmsub3JpZ2luYWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGF3YWl0IHRoaXMudXBkYXRlQ2hhbmdlZExpbmtJbk5vdGUobm90ZVBhdGgsIGNoYW5nZWRMaW5rcyk7XHJcblx0XHRyZXR1cm4gY2hhbmdlZExpbmtzO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUNoYW5nZWRFbWJlZEluTm90ZShub3RlUGF0aDogc3RyaW5nLCBjaGFuZ2VkRW1iZWRzOiBFbWJlZENoYW5nZUluZm9bXSkge1xyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlUGF0aCkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRsZXQgbm90ZUZpbGUgPSB0aGlzLmdldEZpbGVCeVBhdGgobm90ZVBhdGgpO1xyXG5cdFx0aWYgKCFub3RlRmlsZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiY2FuJ3QgdXBkYXRlIGVtYmVkcyBpbiBub3RlLCBmaWxlIG5vdCBmb3VuZDogXCIgKyBub3RlUGF0aCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQobm90ZUZpbGUpO1xyXG5cdFx0bGV0IGRpcnR5ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKGNoYW5nZWRFbWJlZHMgJiYgY2hhbmdlZEVtYmVkcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAobGV0IGVtYmVkIG9mIGNoYW5nZWRFbWJlZHMpIHtcclxuXHRcdFx0XHRpZiAoZW1iZWQub2xkLmxpbmsgPT0gZW1iZWQubmV3TGluaylcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0lzQ29ycmVjdE1hcmtkb3duRW1iZWQoZW1iZWQub2xkLm9yaWdpbmFsKSkge1xyXG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShlbWJlZC5vbGQub3JpZ2luYWwsICchWycgKyBlbWJlZC5vbGQuZGlzcGxheVRleHQgKyAnXScgKyAnKCcgKyBlbWJlZC5uZXdMaW5rICsgJyknKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuY2hlY2tJc0NvcnJlY3RXaWtpRW1iZWQoZW1iZWQub2xkLm9yaWdpbmFsKSkge1xyXG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShlbWJlZC5vbGQub3JpZ2luYWwsICchW1snICsgZW1iZWQubmV3TGluayArICddXScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIG5vdGVQYXRoICsgXCIgaGFzIGJhZCBlbWJlZCAoZm9ybWF0IG9mIGxpbmsgaXMgbm90IG1hZWtkb3duIG9yIHdpa2kgbGluayk6IFwiICsgZW1iZWQub2xkLm9yaWdpbmFsKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJlbWJlZCB1cGRhdGVkIGluIG5vdGUgW25vdGUsIG9sZCBsaW5rLCBuZXcgbGlua106IFxcbiAgIFwiXHJcblx0XHRcdFx0XHQrIG5vdGVGaWxlLnBhdGggKyBcIlxcbiAgIFwiICsgZW1iZWQub2xkLmxpbmsgKyBcIlxcbiAgIFwiICsgZW1iZWQubmV3TGluaylcclxuXHJcblx0XHRcdFx0ZGlydHkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcnR5KVxyXG5cdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkobm90ZUZpbGUsIHRleHQpO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIHVwZGF0ZUNoYW5nZWRMaW5rSW5Ob3RlKG5vdGVQYXRoOiBzdHJpbmcsIGNoYW5kZWRMaW5rczogTGlua0NoYW5nZUluZm9bXSkge1xyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlUGF0aCkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRsZXQgbm90ZUZpbGUgPSB0aGlzLmdldEZpbGVCeVBhdGgobm90ZVBhdGgpO1xyXG5cdFx0aWYgKCFub3RlRmlsZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiY2FuJ3QgdXBkYXRlIGxpbmtzIGluIG5vdGUsIGZpbGUgbm90IGZvdW5kOiBcIiArIG5vdGVQYXRoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZXh0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChub3RlRmlsZSk7XHJcblx0XHRsZXQgZGlydHkgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAoY2hhbmRlZExpbmtzICYmIGNoYW5kZWRMaW5rcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAobGV0IGxpbmsgb2YgY2hhbmRlZExpbmtzKSB7XHJcblx0XHRcdFx0aWYgKGxpbmsub2xkLmxpbmsgPT0gbGluay5uZXdMaW5rKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmNoZWNrSXNDb3JyZWN0TWFya2Rvd25MaW5rKGxpbmsub2xkLm9yaWdpbmFsKSkge1xyXG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShsaW5rLm9sZC5vcmlnaW5hbCwgJ1snICsgbGluay5vbGQuZGlzcGxheVRleHQgKyAnXScgKyAnKCcgKyBsaW5rLm5ld0xpbmsgKyAnKScpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5jaGVja0lzQ29ycmVjdFdpa2lMaW5rKGxpbmsub2xkLm9yaWdpbmFsKSkge1xyXG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShsaW5rLm9sZC5vcmlnaW5hbCwgJ1tbJyArIGxpbmsubmV3TGluayArICddXScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIG5vdGVQYXRoICsgXCIgaGFzIGJhZCBsaW5rIChmb3JtYXQgb2YgbGluayBpcyBub3QgbWFla2Rvd24gb3Igd2lraSBsaW5rKTogXCIgKyBsaW5rLm9sZC5vcmlnaW5hbCk7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiY2FjaGVkIGxpbmsgdXBkYXRlZCBpbiBub3RlIFtub3RlLCBvbGQgbGluaywgbmV3IGxpbmtdOiBcXG4gICBcIlxyXG5cdFx0XHRcdFx0KyBub3RlRmlsZS5wYXRoICsgXCJcXG4gICBcIiArIGxpbmsub2xkLmxpbmsgKyBcIlxcbiAgIFwiICsgbGluay5uZXdMaW5rKVxyXG5cclxuXHRcdFx0XHRkaXJ0eSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlydHkpXHJcblx0XHRcdGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShub3RlRmlsZSwgdGV4dCk7XHJcblx0fVxyXG5cclxuXHJcblx0YXN5bmMgcmVwbGFjZUFsbE5vdGVXaWtpbGlua3NXaXRoTWFya2Rvd25MaW5rcyhub3RlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxMaW5rc0FuZEVtYmVkc0NoYW5nZWRJbmZvPiB7XHJcblx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGVQYXRoKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGxldCByZXM6IExpbmtzQW5kRW1iZWRzQ2hhbmdlZEluZm8gPSB7XHJcblx0XHRcdGxpbmtzOiBbXSxcclxuXHRcdFx0ZW1iZWRzOiBbXSxcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgbm90ZUZpbGUgPSB0aGlzLmdldEZpbGVCeVBhdGgobm90ZVBhdGgpO1xyXG5cdFx0aWYgKCFub3RlRmlsZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiY2FuJ3QgdXBkYXRlIHdpa2lsaW5rcyBpbiBub3RlLCBmaWxlIG5vdCBmb3VuZDogXCIgKyBub3RlUGF0aCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjYWNoZSA9IGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlUGF0aCk7XHJcblx0XHRsZXQgbGlua3MgPSBjYWNoZS5saW5rcztcclxuXHRcdGxldCBlbWJlZHMgPSBjYWNoZS5lbWJlZHM7XHJcblx0XHRsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQobm90ZUZpbGUpO1xyXG5cdFx0bGV0IGRpcnR5ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKGVtYmVkcykgeyAvL2VtYmVkcyBtdXN0IGdvIGZpcnN0IVxyXG5cdFx0XHRmb3IgKGxldCBlbWJlZCBvZiBlbWJlZHMpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0lzQ29ycmVjdFdpa2lFbWJlZChlbWJlZC5vcmlnaW5hbCkpIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgbmV3UGF0aCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JMaW5rKGVtYmVkLmxpbmspXHJcblx0XHRcdFx0XHRsZXQgbmV3TGluayA9ICchWycgKyAnXScgKyAnKCcgKyBuZXdQYXRoICsgJyknXHJcblx0XHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKGVtYmVkLm9yaWdpbmFsLCBuZXdMaW5rKTtcclxuXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLmNvbnNvbGVMb2dQcmVmaXggKyBcIndpa2kgbGluayAoZW1iZWQpIHJlcGxhY2VkIGluIG5vdGUgW25vdGUsIG9sZCBsaW5rLCBuZXcgbGlua106IFxcbiAgIFwiXHJcblx0XHRcdFx0XHRcdCsgbm90ZUZpbGUucGF0aCArIFwiXFxuICAgXCIgKyBlbWJlZC5vcmlnaW5hbCArIFwiXFxuICAgXCIgKyBuZXdMaW5rKVxyXG5cclxuXHRcdFx0XHRcdHJlcy5lbWJlZHMucHVzaCh7IG9sZDogZW1iZWQsIG5ld0xpbms6IG5ld0xpbmsgfSlcclxuXHJcblx0XHRcdFx0XHRkaXJ0eSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGxpbmtzKSB7XHJcblx0XHRcdGZvciAobGV0IGxpbmsgb2YgbGlua3MpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5jaGVja0lzQ29ycmVjdFdpa2lMaW5rKGxpbmsub3JpZ2luYWwpKSB7XHJcblx0XHRcdFx0XHRsZXQgbmV3UGF0aCA9IFV0aWxzLm5vcm1hbGl6ZVBhdGhGb3JMaW5rKGxpbmsubGluaylcclxuXHJcblx0XHRcdFx0XHRsZXQgZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGluay5saW5rLCBub3RlUGF0aCk7XHJcblx0XHRcdFx0XHRpZiAoZmlsZSAmJiBmaWxlLmV4dGVuc2lvbiA9PSBcIm1kXCIgJiYgIW5ld1BhdGguZW5kc1dpdGgoXCIubWRcIikpXHJcblx0XHRcdFx0XHRcdG5ld1BhdGggPSBuZXdQYXRoICsgXCIubWRcIjtcclxuXHJcblx0XHRcdFx0XHRsZXQgbmV3TGluayA9ICdbJyArIGxpbmsuZGlzcGxheVRleHQgKyAnXScgKyAnKCcgKyBuZXdQYXRoICsgJyknXHJcblx0XHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKGxpbmsub3JpZ2luYWwsIG5ld0xpbmspO1xyXG5cclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwid2lraSBsaW5rIHJlcGxhY2VkIGluIG5vdGUgW25vdGUsIG9sZCBsaW5rLCBuZXcgbGlua106IFxcbiAgIFwiXHJcblx0XHRcdFx0XHRcdCsgbm90ZUZpbGUucGF0aCArIFwiXFxuICAgXCIgKyBsaW5rLm9yaWdpbmFsICsgXCJcXG4gICBcIiArIG5ld0xpbmspXHJcblxyXG5cdFx0XHRcdFx0cmVzLmxpbmtzLnB1c2goeyBvbGQ6IGxpbmssIG5ld0xpbms6IG5ld0xpbmsgfSlcclxuXHJcblx0XHRcdFx0XHRkaXJ0eSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcnR5KVxyXG5cdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkobm90ZUZpbGUsIHRleHQpO1xyXG5cclxuXHRcdHJldHVybiByZXM7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgVEFic3RyYWN0RmlsZSwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IExpbmtzSGFuZGxlciwgUGF0aENoYW5nZUluZm8gfSBmcm9tICcuL2xpbmtzLWhhbmRsZXInO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBwYXRoIH0gZnJvbSAnLi9wYXRoJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTW92ZWRBdHRhY2htZW50UmVzdWx0IHtcclxuXHRtb3ZlZEF0dGFjaG1lbnRzOiBQYXRoQ2hhbmdlSW5mb1tdXHJcblx0cmVuYW1lZEZpbGVzOiBQYXRoQ2hhbmdlSW5mb1tdLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsZXNIYW5kbGVyIHtcclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHByaXZhdGUgYXBwOiBBcHAsXHJcblx0XHRwcml2YXRlIGxoOiBMaW5rc0hhbmRsZXIsXHJcblx0XHRwcml2YXRlIGNvbnNvbGVMb2dQcmVmaXg6IHN0cmluZyA9IFwiXCIsXHJcblx0XHRwcml2YXRlIGlnbm9yZUZvbGRlcnM6IHN0cmluZ1tdID0gW10sXHJcblx0XHRwcml2YXRlIGlnbm9yZUZpbGVzUmVnZXg6IFJlZ0V4cFtdID0gW10sXHJcblx0KSB7IH1cclxuXHJcblx0aXNQYXRoSWdub3JlZChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGlmIChwYXRoLnN0YXJ0c1dpdGgoXCIuL1wiKSlcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyaW5nKDIpO1xyXG5cclxuXHRcdGZvciAobGV0IGZvbGRlciBvZiB0aGlzLmlnbm9yZUZvbGRlcnMpIHtcclxuXHRcdFx0aWYgKHBhdGguc3RhcnRzV2l0aChmb2xkZXIpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBmaWxlUmVnZXggb2YgdGhpcy5pZ25vcmVGaWxlc1JlZ2V4KSB7XHJcblx0XHRcdGxldCB0ZXN0UmVzdWx0ID0gZmlsZVJlZ2V4LnRlc3QocGF0aClcclxuXHRcdFx0Ly8gY29uc29sZS5sb2cocGF0aCxmaWxlUmVnZXgsdGVzdFJlc3VsdClcclxuXHRcdFx0aWYodGVzdFJlc3VsdCkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBjcmVhdGVGb2xkZXJGb3JBdHRhY2htZW50RnJvbUxpbmsobGluazogc3RyaW5nLCBvd25pbmdOb3RlUGF0aDogc3RyaW5nKSB7XHJcblx0XHRsZXQgbmV3RnVsbFBhdGggPSB0aGlzLmxoLmdldEZ1bGxQYXRoRm9yTGluayhsaW5rLCBvd25pbmdOb3RlUGF0aCk7XHJcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5jcmVhdGVGb2xkZXJGb3JBdHRhY2htZW50RnJvbVBhdGgobmV3RnVsbFBhdGgpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgY3JlYXRlRm9sZGVyRm9yQXR0YWNobWVudEZyb21QYXRoKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuXHRcdGxldCBuZXdQYXJlbnRGb2xkZXIgPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdC8vdG9kbyBjaGVjayBmaWxkZXIgZXhpc3RcclxuXHRcdFx0YXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKG5ld1BhcmVudEZvbGRlcilcclxuXHRcdH0gY2F0Y2ggeyB9XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZUZpbGVDb3B5TmFtZShvcmlnaW5hbE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRsZXQgZXh0ID0gcGF0aC5leHRuYW1lKG9yaWdpbmFsTmFtZSk7XHJcblx0XHRsZXQgYmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsTmFtZSwgZXh0KTtcclxuXHRcdGxldCBkaXIgPSBwYXRoLmRpcm5hbWUob3JpZ2luYWxOYW1lKTtcclxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgMTAwMDAwOyBpKyspIHtcclxuXHRcdFx0bGV0IG5ld05hbWUgPSBkaXIgKyBcIi9cIiArIGJhc2VOYW1lICsgXCIgXCIgKyBpICsgZXh0O1xyXG5cdFx0XHRsZXQgZXhpc3RGaWxlID0gdGhpcy5saC5nZXRGaWxlQnlQYXRoKG5ld05hbWUpO1xyXG5cdFx0XHRpZiAoIWV4aXN0RmlsZSlcclxuXHRcdFx0XHRyZXR1cm4gbmV3TmFtZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgbW92ZUNhY2hlZE5vdGVBdHRhY2htZW50cyhvbGROb3RlUGF0aDogc3RyaW5nLCBuZXdOb3RlUGF0aDogc3RyaW5nLFxyXG5cdFx0ZGVsZXRlRXhpc3RGaWxlczogYm9vbGVhbiwgYXR0YWNobWVudHNTdWJmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8TW92ZWRBdHRhY2htZW50UmVzdWx0PiB7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChvbGROb3RlUGF0aCkgfHwgdGhpcy5pc1BhdGhJZ25vcmVkKG5ld05vdGVQYXRoKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdC8vdHJ5IHRvIGdldCBlbWJlZHMgZm9yIG9sZCBvciBuZXcgcGF0aCAobWV0YWRhdGFDYWNoZSBjYW4gYmUgdXBkYXRlZCBvciBub3QpXHJcblx0XHQvLyEhISB0aGlzIGNhbiByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdGUgd2FzIGp1c3QgdXBkYXRlZFxyXG5cclxuXHRcdGxldCBlbWJlZHMgPSAoYXdhaXQgVXRpbHMuZ2V0Q2FjaGVTYWZlKG5ld05vdGVQYXRoKSkuZW1iZWRzO1xyXG5cclxuXHRcdGlmICghZW1iZWRzKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0bGV0IHJlc3VsdDogTW92ZWRBdHRhY2htZW50UmVzdWx0ID0ge1xyXG5cdFx0XHRtb3ZlZEF0dGFjaG1lbnRzOiBbXSxcclxuXHRcdFx0cmVuYW1lZEZpbGVzOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKGxldCBlbWJlZCBvZiBlbWJlZHMpIHtcclxuXHRcdFx0bGV0IGxpbmsgPSBlbWJlZC5saW5rO1xyXG5cdFx0XHRsZXQgb2xkTGlua1BhdGggPSB0aGlzLmxoLmdldEZ1bGxQYXRoRm9yTGluayhsaW5rLCBvbGROb3RlUGF0aCk7XHJcblxyXG5cdFx0XHRpZiAocmVzdWx0Lm1vdmVkQXR0YWNobWVudHMuZmluZEluZGV4KHggPT4geC5vbGRQYXRoID09IG9sZExpbmtQYXRoKSAhPSAtMSlcclxuXHRcdFx0XHRjb250aW51ZTsvL2FscmVhZHkgbW92ZWRcclxuXHJcblx0XHRcdGxldCBmaWxlID0gdGhpcy5saC5nZXRGaWxlQnlMaW5rKGxpbmssIG9sZE5vdGVQYXRoKTtcclxuXHRcdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdFx0ZmlsZSA9IHRoaXMubGguZ2V0RmlsZUJ5TGluayhsaW5rLCBuZXdOb3RlUGF0aCk7XHJcblx0XHRcdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIG9sZE5vdGVQYXRoICsgXCIgaGFzIGJhZCBlbWJlZCAoZmlsZSBkb2VzIG5vdCBleGlzdCk6IFwiICsgbGluayk7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vaWYgYXR0YWNobWVudCBub3QgaW4gdGhlIG5vdGUgZm9sZGVyLCBza2lwIGl0XHJcblx0XHRcdC8vID0gXCIuXCIgbWVhbnMgdGhhdCBub3RlIHdhcyBhdCByb290IHBhdGgsIHNvIGRvIG5vdCBza2lwIGl0XHJcblx0XHRcdGlmIChwYXRoLmRpcm5hbWUob2xkTm90ZVBhdGgpICE9IFwiLlwiICYmICFwYXRoLmRpcm5hbWUob2xkTGlua1BhdGgpLnN0YXJ0c1dpdGgocGF0aC5kaXJuYW1lKG9sZE5vdGVQYXRoKSkpXHJcblx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRsZXQgbmV3TGlua1BhdGggPSB0aGlzLmdldE5ld0F0dGFjaG1lbnRQYXRoKGZpbGUucGF0aCwgbmV3Tm90ZVBhdGgsIGF0dGFjaG1lbnRzU3ViZm9sZGVyKTtcclxuXHJcblx0XHRcdGlmIChuZXdMaW5rUGF0aCA9PSBmaWxlLnBhdGgpIC8vbm90aGluZyB0byBtb3ZlXHJcblx0XHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0XHRsZXQgcmVzID0gYXdhaXQgdGhpcy5tb3ZlQXR0YWNobWVudChmaWxlLCBuZXdMaW5rUGF0aCwgW29sZE5vdGVQYXRoLCBuZXdOb3RlUGF0aF0sIGRlbGV0ZUV4aXN0RmlsZXMpO1xyXG5cdFx0XHRyZXN1bHQubW92ZWRBdHRhY2htZW50cyA9IHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLmNvbmNhdChyZXMubW92ZWRBdHRhY2htZW50cyk7XHJcblx0XHRcdHJlc3VsdC5yZW5hbWVkRmlsZXMgPSByZXN1bHQucmVuYW1lZEZpbGVzLmNvbmNhdChyZXMucmVuYW1lZEZpbGVzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGdldE5ld0F0dGFjaG1lbnRQYXRoKG9sZEF0dGFjaG1lbnRQYXRoOiBzdHJpbmcsIG5vdGVQYXRoOiBzdHJpbmcsIHN1YmZvbGRlck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRsZXQgcmVzb2x2ZWRTdWJGb2xkZXJOYW1lID0gc3ViZm9sZGVyTmFtZS5yZXBsYWNlKC9cXCR7ZmlsZW5hbWV9L2csIHBhdGguYmFzZW5hbWUobm90ZVBhdGgsIFwiLm1kXCIpKTtcclxuXHRcdGxldCBuZXdQYXRoID0gKHJlc29sdmVkU3ViRm9sZGVyTmFtZSA9PSBcIlwiKSA/IHBhdGguZGlybmFtZShub3RlUGF0aCkgOiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKG5vdGVQYXRoKSwgcmVzb2x2ZWRTdWJGb2xkZXJOYW1lKTtcclxuXHRcdG5ld1BhdGggPSBVdGlscy5ub3JtYWxpemVQYXRoRm9yRmlsZShwYXRoLmpvaW4obmV3UGF0aCwgcGF0aC5iYXNlbmFtZShvbGRBdHRhY2htZW50UGF0aCkpKTtcclxuXHRcdHJldHVybiBuZXdQYXRoO1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIGNvbGxlY3RBdHRhY2htZW50c0ZvckNhY2hlZE5vdGUobm90ZVBhdGg6IHN0cmluZywgc3ViZm9sZGVyTmFtZTogc3RyaW5nLFxyXG5cdFx0ZGVsZXRlRXhpc3RGaWxlczogYm9vbGVhbik6IFByb21pc2U8TW92ZWRBdHRhY2htZW50UmVzdWx0PiB7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlUGF0aCkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRsZXQgcmVzdWx0OiBNb3ZlZEF0dGFjaG1lbnRSZXN1bHQgPSB7XHJcblx0XHRcdG1vdmVkQXR0YWNobWVudHM6IFtdLFxyXG5cdFx0XHRyZW5hbWVkRmlsZXM6IFtdXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGNhY2hlID0gYXdhaXQgVXRpbHMuZ2V0Q2FjaGVTYWZlKG5vdGVQYXRoKTtcclxuXHJcblx0XHRjb25zdCBsaW5rT2JqcyA9IFsuLi4oY2FjaGUuZW1iZWRzID8/IFtdKSwgLi4uKGNhY2hlLmxpbmtzID8/IFtdKV07XHJcblxyXG5cdFx0Zm9yIChsZXQgbGlua09iaiBvZiBsaW5rT2Jqcykge1xyXG5cdFx0XHRsZXQgbGluayA9IHRoaXMubGguc3BsaXRMaW5rVG9QYXRoQW5kU2VjdGlvbihsaW5rT2JqLmxpbmspLmxpbms7XHJcblxyXG5cdFx0XHRpZiAobGluay5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG5cdFx0XHRcdC8vIGludGVybmFsIHNlY3Rpb24gbGlua1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgZnVsbFBhdGhMaW5rID0gdGhpcy5saC5nZXRGdWxsUGF0aEZvckxpbmsobGluaywgbm90ZVBhdGgpO1xyXG5cdFx0XHRpZiAocmVzdWx0Lm1vdmVkQXR0YWNobWVudHMuZmluZEluZGV4KHggPT4geC5vbGRQYXRoID09IGZ1bGxQYXRoTGluaykgIT0gLTEpIHtcclxuXHRcdFx0XHQvLyBhbHJlYWR5IG1vdmVkXHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBmaWxlID0gdGhpcy5saC5nZXRGaWxlQnlMaW5rKGxpbmssIG5vdGVQYXRoKVxyXG5cdFx0XHRpZiAoIWZpbGUpIHtcclxuXHRcdFx0XHRjb25zdCB0eXBlID0gbGlua09iai5vcmlnaW5hbC5zdGFydHNXaXRoKFwiIVwiKSA/IFwiZW1iZWRcIiA6IFwibGlua1wiO1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYCR7dGhpcy5jb25zb2xlTG9nUHJlZml4fSR7bm90ZVBhdGh9IGhhcyBiYWQgJHt0eXBlfSAoZmlsZSBkb2VzIG5vdCBleGlzdCk6ICR7bGlua31gKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZmlsZS5leHRlbnNpb24udG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRcdGlmIChleHRlbnNpb24gPT09IFwibWRcIiB8fCBmaWxlLmV4dGVuc2lvbiA9PT0gXCJjYW52YXNcIikge1xyXG5cdFx0XHRcdC8vIGludGVybmFsIGZpbGUgbGlua1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmV3UGF0aCA9IHRoaXMuZ2V0TmV3QXR0YWNobWVudFBhdGgoZmlsZS5wYXRoLCBub3RlUGF0aCwgc3ViZm9sZGVyTmFtZSk7XHJcblxyXG5cdFx0XHRpZiAobmV3UGF0aCA9PSBmaWxlLnBhdGgpIHtcclxuXHRcdFx0XHQvLyBub3RoaW5nIHRvIG1vdmVcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHJlcyA9IGF3YWl0IHRoaXMubW92ZUF0dGFjaG1lbnQoZmlsZSwgbmV3UGF0aCwgW25vdGVQYXRoXSwgZGVsZXRlRXhpc3RGaWxlcyk7XHJcblxyXG5cdFx0XHRyZXN1bHQubW92ZWRBdHRhY2htZW50cyA9IHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLmNvbmNhdChyZXMubW92ZWRBdHRhY2htZW50cyk7XHJcblx0XHRcdHJlc3VsdC5yZW5hbWVkRmlsZXMgPSByZXN1bHQucmVuYW1lZEZpbGVzLmNvbmNhdChyZXMucmVuYW1lZEZpbGVzKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblxyXG5cdGFzeW5jIG1vdmVBdHRhY2htZW50KGZpbGU6IFRGaWxlLCBuZXdMaW5rUGF0aDogc3RyaW5nLCBwYXJlbnROb3RlUGF0aHM6IHN0cmluZ1tdLCBkZWxldGVFeGlzdEZpbGVzOiBib29sZWFuKTogUHJvbWlzZTxNb3ZlZEF0dGFjaG1lbnRSZXN1bHQ+IHtcclxuXHRcdGNvbnN0IHBhdGggPSBmaWxlLnBhdGg7XHJcblxyXG5cdFx0bGV0IHJlc3VsdDogTW92ZWRBdHRhY2htZW50UmVzdWx0ID0ge1xyXG5cdFx0XHRtb3ZlZEF0dGFjaG1lbnRzOiBbXSxcclxuXHRcdFx0cmVuYW1lZEZpbGVzOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKHBhdGgpKVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cclxuXHJcblx0XHRpZiAocGF0aCA9PSBuZXdMaW5rUGF0aCkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4odGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJDYW4ndCBtb3ZlIGZpbGUuIFNvdXJjZSBhbmQgZGVzdGluYXRpb24gcGF0aCB0aGUgc2FtZS5cIilcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHRhd2FpdCB0aGlzLmNyZWF0ZUZvbGRlckZvckF0dGFjaG1lbnRGcm9tUGF0aChuZXdMaW5rUGF0aCk7XHJcblxyXG5cdFx0bGV0IGxpbmtlZE5vdGVzID0gYXdhaXQgdGhpcy5saC5nZXRDYWNoZWROb3Rlc1RoYXRIYXZlTGlua1RvRmlsZShwYXRoKTtcclxuXHRcdGlmIChwYXJlbnROb3RlUGF0aHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgbm90ZVBhdGggb2YgcGFyZW50Tm90ZVBhdGhzKSB7XHJcblx0XHRcdFx0bGlua2VkTm90ZXMucmVtb3ZlKG5vdGVQYXRoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXRoICE9PSBmaWxlLnBhdGgpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwiRmlsZSB3YXMgbW92ZWQgYWxyZWFkeVwiKVxyXG5cdFx0XHRyZXR1cm4gYXdhaXQgdGhpcy5tb3ZlQXR0YWNobWVudChmaWxlLCBuZXdMaW5rUGF0aCwgcGFyZW50Tm90ZVBhdGhzLCBkZWxldGVFeGlzdEZpbGVzKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIG5vIG90aGVyIGZpbGUgaGFzIGxpbmsgdG8gdGhpcyBmaWxlIC0gdHJ5IHRvIG1vdmUgZmlsZVxyXG5cdFx0Ly9pZiBmaWxlIGFscmVhZHkgZXhpc3QgYXQgbmV3IGxvY2F0aW9uIC0gZGVsZXRlIG9yIG1vdmUgd2l0aCBuZXcgbmFtZVxyXG5cdFx0aWYgKGxpbmtlZE5vdGVzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdGxldCBleGlzdEZpbGUgPSB0aGlzLmxoLmdldEZpbGVCeVBhdGgobmV3TGlua1BhdGgpO1xyXG5cdFx0XHRpZiAoIWV4aXN0RmlsZSkge1xyXG5cdFx0XHRcdC8vbW92ZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuY29uc29sZUxvZ1ByZWZpeCArIFwibW92ZSBmaWxlIFtmcm9tLCB0b106IFxcbiAgIFwiICsgcGF0aCArIFwiXFxuICAgXCIgKyBuZXdMaW5rUGF0aClcclxuXHRcdFx0XHRyZXN1bHQubW92ZWRBdHRhY2htZW50cy5wdXNoKHsgb2xkUGF0aDogcGF0aCwgbmV3UGF0aDogbmV3TGlua1BhdGggfSlcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC5yZW5hbWUoZmlsZSwgbmV3TGlua1BhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChkZWxldGVFeGlzdEZpbGVzKSB7XHJcblx0XHRcdFx0XHQvL2RlbGV0ZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJkZWxldGUgZmlsZTogXFxuICAgXCIgKyBwYXRoKVxyXG5cdFx0XHRcdFx0cmVzdWx0Lm1vdmVkQXR0YWNobWVudHMucHVzaCh7IG9sZFBhdGg6IHBhdGgsIG5ld1BhdGg6IG5ld0xpbmtQYXRoIH0pXHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmaWxlLCB0cnVlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9tb3ZlIHdpdGggbmV3IG5hbWVcclxuXHRcdFx0XHRcdGxldCBuZXdGaWxlQ29weU5hbWUgPSB0aGlzLmdlbmVyYXRlRmlsZUNvcHlOYW1lKG5ld0xpbmtQYXRoKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJjb3B5IGZpbGUgd2l0aCBuZXcgbmFtZSBbZnJvbSwgdG9dOiBcXG4gICBcIiArIHBhdGggKyBcIlxcbiAgIFwiICsgbmV3RmlsZUNvcHlOYW1lKVxyXG5cdFx0XHRcdFx0cmVzdWx0Lm1vdmVkQXR0YWNobWVudHMucHVzaCh7IG9sZFBhdGg6IHBhdGgsIG5ld1BhdGg6IG5ld0ZpbGVDb3B5TmFtZSB9KVxyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5hcHAudmF1bHQucmVuYW1lKGZpbGUsIG5ld0ZpbGVDb3B5TmFtZSk7XHJcblx0XHRcdFx0XHRyZXN1bHQucmVuYW1lZEZpbGVzLnB1c2goeyBvbGRQYXRoOiBuZXdMaW5rUGF0aCwgbmV3UGF0aDogbmV3RmlsZUNvcHlOYW1lIH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2lmIHNvbWUgb3RoZXIgZmlsZSBoYXMgbGluayB0byB0aGlzIGZpbGUgLSB0cnkgdG8gY29weSBmaWxlXHJcblx0XHQvL2lmIGZpbGUgYWxyZWFkeSBleGlzdCBhdCBuZXcgbG9jYXRpb24gLSBjb3B5IGZpbGUgd2l0aCBuZXcgbmFtZSBvciBkbyBub3RoaW5nXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGV0IGV4aXN0RmlsZSA9IHRoaXMubGguZ2V0RmlsZUJ5UGF0aChuZXdMaW5rUGF0aCk7XHJcblx0XHRcdGlmICghZXhpc3RGaWxlKSB7XHJcblx0XHRcdFx0Ly9jb3B5XHJcblx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJjb3B5IGZpbGUgW2Zyb20sIHRvXTogXFxuICAgXCIgKyBwYXRoICsgXCJcXG4gICBcIiArIG5ld0xpbmtQYXRoKVxyXG5cdFx0XHRcdHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLnB1c2goeyBvbGRQYXRoOiBwYXRoLCBuZXdQYXRoOiBuZXdMaW5rUGF0aCB9KVxyXG5cdFx0XHRcdGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNvcHkoZmlsZSwgbmV3TGlua1BhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChkZWxldGVFeGlzdEZpbGVzKSB7XHJcblx0XHRcdFx0XHQvL2RvIG5vdGhpbmdcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9jb3B5IHdpdGggbmV3IG5hbWVcclxuXHRcdFx0XHRcdGxldCBuZXdGaWxlQ29weU5hbWUgPSB0aGlzLmdlbmVyYXRlRmlsZUNvcHlOYW1lKG5ld0xpbmtQYXRoKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJjb3B5IGZpbGUgd2l0aCBuZXcgbmFtZSBbZnJvbSwgdG9dOiBcXG4gICBcIiArIHBhdGggKyBcIlxcbiAgIFwiICsgbmV3RmlsZUNvcHlOYW1lKVxyXG5cdFx0XHRcdFx0cmVzdWx0Lm1vdmVkQXR0YWNobWVudHMucHVzaCh7IG9sZFBhdGg6IGZpbGUucGF0aCwgbmV3UGF0aDogbmV3RmlsZUNvcHlOYW1lIH0pXHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC5jb3B5KGZpbGUsIG5ld0ZpbGVDb3B5TmFtZSk7XHJcblx0XHRcdFx0XHRyZXN1bHQucmVuYW1lZEZpbGVzLnB1c2goeyBvbGRQYXRoOiBuZXdMaW5rUGF0aCwgbmV3UGF0aDogbmV3RmlsZUNvcHlOYW1lIH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0YXN5bmMgZGVsZXRlRW1wdHlGb2xkZXJzKGRpck5hbWU6IHN0cmluZykge1xyXG5cdFx0aWYgKHRoaXMuaXNQYXRoSWdub3JlZChkaXJOYW1lKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmIChkaXJOYW1lLnN0YXJ0c1dpdGgoXCIuL1wiKSlcclxuXHRcdFx0ZGlyTmFtZSA9IGRpck5hbWUuc3Vic3RyaW5nKDIpO1xyXG5cclxuXHJcblx0XHRsZXQgbGlzdCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIubGlzdChkaXJOYW1lKTtcclxuXHRcdGZvciAobGV0IGZvbGRlciBvZiBsaXN0LmZvbGRlcnMpIHtcclxuXHRcdFx0YXdhaXQgdGhpcy5kZWxldGVFbXB0eUZvbGRlcnMoZm9sZGVyKVxyXG5cdFx0fVxyXG5cclxuXHRcdGxpc3QgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmxpc3QoZGlyTmFtZSk7XHJcblx0XHRpZiAobGlzdC5maWxlcy5sZW5ndGggPT0gMCAmJiBsaXN0LmZvbGRlcnMubGVuZ3RoID09IDApIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy5jb25zb2xlTG9nUHJlZml4ICsgXCJkZWxldGUgZW1wdHkgZm9sZGVyOiBcXG4gICBcIiArIGRpck5hbWUpXHJcblx0XHRcdGlmIChhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmV4aXN0cyhkaXJOYW1lKSlcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJtZGlyKGRpck5hbWUsIGZhbHNlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGRlbGV0ZVVudXNlZEF0dGFjaG1lbnRzRm9yQ2FjaGVkTm90ZShub3RlUGF0aDogc3RyaW5nKSB7XHJcblx0XHRpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGVQYXRoKSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdC8vISEhIHRoaXMgY2FuIHJldHVybiB1bmRlZmluZWQgaWYgbm90ZSB3YXMganVzdCB1cGRhdGVkXHJcblx0XHRsZXQgZW1iZWRzID0gKGF3YWl0IFV0aWxzLmdldENhY2hlU2FmZShub3RlUGF0aCkpLmVtYmVkcztcclxuXHRcdGlmIChlbWJlZHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgZW1iZWQgb2YgZW1iZWRzKSB7XHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbWJlZC5saW5rO1xyXG5cclxuXHRcdFx0XHRsZXQgZnVsbFBhdGggPSB0aGlzLmxoLmdldEZ1bGxQYXRoRm9yTGluayhsaW5rLCBub3RlUGF0aCk7XHJcblx0XHRcdFx0bGV0IGxpbmtlZE5vdGVzID0gYXdhaXQgdGhpcy5saC5nZXRDYWNoZWROb3Rlc1RoYXRIYXZlTGlua1RvRmlsZShmdWxsUGF0aCk7XHJcblx0XHRcdFx0aWYgKGxpbmtlZE5vdGVzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRsZXQgZmlsZSA9IHRoaXMubGguZ2V0RmlsZUJ5TGluayhsaW5rLCBub3RlUGF0aCwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0aWYgKGZpbGUpIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmaWxlLCB0cnVlKTtcclxuXHRcdFx0XHRcdFx0fSBjYXRjaCB7IH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG59XHJcblxyXG5cclxuIiwiaW1wb3J0IHtcclxuICBBcHAsXHJcbiAgUGx1Z2luLFxyXG4gIFRBYnN0cmFjdEZpbGUsXHJcbiAgVEZpbGUsXHJcbiAgRW1iZWRDYWNoZSxcclxuICBMaW5rQ2FjaGUsXHJcbiAgTm90aWNlLFxyXG4gIEVkaXRvcixcclxuICBNYXJrZG93blZpZXcsXHJcbn0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBQbHVnaW5TZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUywgU2V0dGluZ1RhYiB9IGZyb20gJy4vc2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBMaW5rc0hhbmRsZXIsIFBhdGhDaGFuZ2VJbmZvIH0gZnJvbSAnLi9saW5rcy1oYW5kbGVyJztcclxuaW1wb3J0IHsgRmlsZXNIYW5kbGVyLCBNb3ZlZEF0dGFjaG1lbnRSZXN1bHQgfSBmcm9tICcuL2ZpbGVzLWhhbmRsZXInO1xyXG5pbXBvcnQgeyBwYXRoIH0gZnJvbSAnLi9wYXRoJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnNpc3RlbnRBdHRhY2htZW50c0FuZExpbmtzIGV4dGVuZHMgUGx1Z2luIHtcclxuICBzZXR0aW5nczogUGx1Z2luU2V0dGluZ3M7XHJcbiAgbGg6IExpbmtzSGFuZGxlcjtcclxuICBmaDogRmlsZXNIYW5kbGVyO1xyXG5cclxuICByZWNlbnRseVJlbmFtZWRGaWxlczogUGF0aENoYW5nZUluZm9bXSA9IFtdO1xyXG4gIGN1cnJlbnRseVJlbmFtaW5nRmlsZXM6IFBhdGhDaGFuZ2VJbmZvW10gPSBbXTtcclxuICB0aW1lcklkOiBOb2RlSlMuVGltZW91dDtcclxuICByZW5hbWluZ0lzQWN0aXZlID0gZmFsc2U7XHJcblxyXG4gIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxyXG4gICAgICB0aGlzLmFwcC52YXVsdC5vbignZGVsZXRlJywgKGZpbGUpID0+IHRoaXMuaGFuZGxlRGVsZXRlZEZpbGUoZmlsZSkpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgdGhpcy5hcHAudmF1bHQub24oJ3JlbmFtZScsIChmaWxlLCBvbGRQYXRoKSA9PlxyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVuYW1lZEZpbGUoZmlsZSwgb2xkUGF0aClcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2NvbGxlY3QtYWxsLWF0dGFjaG1lbnRzJyxcclxuICAgICAgbmFtZTogJ0NvbGxlY3QgQWxsIEF0dGFjaG1lbnRzJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuY29sbGVjdEFsbEF0dGFjaG1lbnRzKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2NvbGxlY3QtYXR0YWNobWVudHMtY3VycmVudC1ub3RlJyxcclxuICAgICAgbmFtZTogJ0NvbGxlY3QgQXR0YWNobWVudHMgaW4gQ3VycmVudCBOb3RlJyxcclxuICAgICAgZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3KSA9PlxyXG4gICAgICAgIHRoaXMuY29sbGVjdEF0dGFjaG1lbnRzQ3VycmVudE5vdGUoZWRpdG9yLCB2aWV3KSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnZGVsZXRlLWVtcHR5LWZvbGRlcnMnLFxyXG4gICAgICBuYW1lOiAnRGVsZXRlIEVtcHR5IEZvbGRlcnMnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5kZWxldGVFbXB0eUZvbGRlcnMoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnY29udmVydC1hbGwtbGluay1wYXRocy10by1yZWxhdGl2ZScsXHJcbiAgICAgIG5hbWU6ICdDb252ZXJ0IEFsbCBMaW5rIFBhdGhzIHRvIFJlbGF0aXZlJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuY29udmVydEFsbExpbmtQYXRoc1RvUmVsYXRpdmUoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnY29udmVydC1hbGwtZW1iZWQtcGF0aHMtdG8tcmVsYXRpdmUnLFxyXG4gICAgICBuYW1lOiAnQ29udmVydCBBbGwgRW1iZWQgUGF0aHMgdG8gUmVsYXRpdmUnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5jb252ZXJ0QWxsRW1iZWRzUGF0aHNUb1JlbGF0aXZlKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ3JlcGxhY2UtYWxsLXdpa2lsaW5rcy13aXRoLW1hcmtkb3duLWxpbmtzJyxcclxuICAgICAgbmFtZTogJ1JlcGxhY2UgQWxsIFdpa2kgTGlua3Mgd2l0aCBNYXJrZG93biBMaW5rcycsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnJlcGxhY2VBbGxXaWtpbGlua3NXaXRoTWFya2Rvd25MaW5rcygpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdyZW9yZ2FuaXplLXZhdWx0JyxcclxuICAgICAgbmFtZTogJ1Jlb3JnYW5pemUgVmF1bHQnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5yZW9yZ2FuaXplVmF1bHQoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnY2hlY2stY29uc2lzdGVuY3knLFxyXG4gICAgICBuYW1lOiAnQ2hlY2sgVmF1bHQgY29uc2lzdGVuY3knLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5jaGVja0NvbnNpc3RlbmN5KCksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBtYWtlIHJlZ2V4IGZyb20gZ2l2ZW4gc3RyaW5nc1xyXG4gICAgdGhpcy5zZXR0aW5ncy5pZ25vcmVGaWxlc1JlZ2V4ID0gdGhpcy5zZXR0aW5ncy5pZ25vcmVGaWxlcy5tYXAoKHZhbCkgPT5cclxuICAgICAgUmVnRXhwKHZhbClcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5saCA9IG5ldyBMaW5rc0hhbmRsZXIoXHJcbiAgICAgIHRoaXMuYXBwLFxyXG4gICAgICAnQ29uc2lzdGVudCBBdHRhY2htZW50cyBhbmQgTGlua3M6ICcsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MuaWdub3JlRm9sZGVycyxcclxuICAgICAgdGhpcy5zZXR0aW5ncy5pZ25vcmVGaWxlc1JlZ2V4XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZmggPSBuZXcgRmlsZXNIYW5kbGVyKFxyXG4gICAgICB0aGlzLmFwcCxcclxuICAgICAgdGhpcy5saCxcclxuICAgICAgJ0NvbnNpc3RlbnQgQXR0YWNobWVudHMgYW5kIExpbmtzOiAnLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLmlnbm9yZUZvbGRlcnMsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MuaWdub3JlRmlsZXNSZWdleFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGlzUGF0aElnbm9yZWQocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBpZiAocGF0aC5zdGFydHNXaXRoKCcuLycpKSBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMik7XHJcblxyXG4gICAgZm9yIChsZXQgZm9sZGVyIG9mIHRoaXMuc2V0dGluZ3MuaWdub3JlRm9sZGVycykge1xyXG4gICAgICBpZiAocGF0aC5zdGFydHNXaXRoKGZvbGRlcikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGZpbGVSZWdleCBvZiB0aGlzLnNldHRpbmdzLmlnbm9yZUZpbGVzUmVnZXgpIHtcclxuICAgICAgaWYgKGZpbGVSZWdleC50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGhhbmRsZURlbGV0ZWRGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcclxuICAgIGlmICh0aGlzLmlzUGF0aElnbm9yZWQoZmlsZS5wYXRoKSkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBmaWxlRXh0ID0gZmlsZS5wYXRoLnN1YnN0cmluZyhmaWxlLnBhdGgubGFzdEluZGV4T2YoJy4nKSk7XHJcbiAgICBpZiAoZmlsZUV4dCA9PSAnLm1kJykge1xyXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWxldGVBdHRhY2htZW50c1dpdGhOb3RlKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5maC5kZWxldGVVbnVzZWRBdHRhY2htZW50c0ZvckNhY2hlZE5vdGUoZmlsZS5wYXRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9kZWxldGUgY2hpbGQgZm9sZGVycyAoZG8gbm90IGRlbGV0ZSBwYXJlbnQpXHJcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRlbGV0ZUVtcHR5Rm9sZGVycykge1xyXG4gICAgICAgIGlmIChhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmV4aXN0cyhwYXRoLmRpcm5hbWUoZmlsZS5wYXRoKSkpIHtcclxuICAgICAgICAgIGxldCBsaXN0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5saXN0KHBhdGguZGlybmFtZShmaWxlLnBhdGgpKTtcclxuICAgICAgICAgIGZvciAobGV0IGZvbGRlciBvZiBsaXN0LmZvbGRlcnMpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5maC5kZWxldGVFbXB0eUZvbGRlcnMoZm9sZGVyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGhhbmRsZVJlbmFtZWRGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUsIG9sZFBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5yZWNlbnRseVJlbmFtZWRGaWxlcy5wdXNoKHsgb2xkUGF0aDogb2xkUGF0aCwgbmV3UGF0aDogZmlsZS5wYXRoIH0pO1xyXG5cclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVySWQpO1xyXG4gICAgdGhpcy50aW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuSGFuZGxlUmVjZW50bHlSZW5hbWVkRmlsZXMoKTtcclxuICAgIH0sIDMwMDApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgSGFuZGxlUmVjZW50bHlSZW5hbWVkRmlsZXMoKSB7XHJcbiAgICBpZiAoIXRoaXMucmVjZW50bHlSZW5hbWVkRmlsZXMgfHwgdGhpcy5yZWNlbnRseVJlbmFtZWRGaWxlcy5sZW5ndGggPT0gMClcclxuICAgICAgLy9ub3RoaW5nIHRvIHJlbmFtZVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgaWYgKHRoaXMucmVuYW1pbmdJc0FjdGl2ZSlcclxuICAgICAgLy9hbHJlYWR5IHN0YXJ0ZWRcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMucmVuYW1pbmdJc0FjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50bHlSZW5hbWluZ0ZpbGVzID0gdGhpcy5yZWNlbnRseVJlbmFtZWRGaWxlczsgLy9jbGVhciBhcnJheSBmb3IgcHVzaGluZyBuZXcgZmlsZXMgYXN5bmNcclxuICAgIHRoaXMucmVjZW50bHlSZW5hbWVkRmlsZXMgPSBbXTtcclxuXHJcbiAgICAvLyBuZXcgTm90aWNlKFwiRml4aW5nIGNvbnNpc3RlbmN5IGZvciBcIiArIHRoaXMuY3VycmVudGx5UmVuYW1pbmdGaWxlcy5sZW5ndGggKyBcIiByZW5hbWVkIGZpbGVzXCIgKyBcIi4uLlwiKTtcclxuICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAnQ29uc2lzdGVudCBBdHRhY2htZW50cyBhbmQgTGlua3M6XFxuRml4aW5nIGNvbnNpc3RlbmN5IGZvciAnICtcclxuICAgICAgICB0aGlzLmN1cnJlbnRseVJlbmFtaW5nRmlsZXMubGVuZ3RoICtcclxuICAgICAgICAnIHJlbmFtZWQgZmlsZXMnICtcclxuICAgICAgICAnLi4uJ1xyXG4gICAgKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBmb3IgKGxldCBmaWxlIG9mIHRoaXMuY3VycmVudGx5UmVuYW1pbmdGaWxlcykge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIHRoaXMuaXNQYXRoSWdub3JlZChmaWxlLm5ld1BhdGgpIHx8XHJcbiAgICAgICAgICB0aGlzLmlzUGF0aElnbm9yZWQoZmlsZS5vbGRQYXRoKVxyXG4gICAgICAgIClcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gYXdhaXQgVXRpbHMuZGVsYXkoMTApOyAvL3dhaXRpbmcgZm9yIHVwZGF0ZSB2YXVsdFxyXG5cclxuICAgICAgICBsZXQgcmVzdWx0OiBNb3ZlZEF0dGFjaG1lbnRSZXN1bHQ7XHJcblxyXG4gICAgICAgIGxldCBmaWxlRXh0ID0gZmlsZS5vbGRQYXRoLnN1YnN0cmluZyhmaWxlLm9sZFBhdGgubGFzdEluZGV4T2YoJy4nKSk7XHJcblxyXG4gICAgICAgIGlmIChmaWxlRXh0ID09ICcubWQnKSB7XHJcbiAgICAgICAgICAvLyBhd2FpdCBVdGlscy5kZWxheSg1MDApOy8vd2FpdGluZyBmb3IgdXBkYXRlIG1ldGFkYXRhQ2FjaGVcclxuXHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHBhdGguZGlybmFtZShmaWxlLm9sZFBhdGgpICE9IHBhdGguZGlybmFtZShmaWxlLm5ld1BhdGgpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYXR0YWNobWVudHNTdWJmb2xkZXIuY29udGFpbnMoJyR7ZmlsZW5hbWV9JylcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tb3ZlQXR0YWNobWVudHNXaXRoTm90ZSkge1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuZmgubW92ZUNhY2hlZE5vdGVBdHRhY2htZW50cyhcclxuICAgICAgICAgICAgICAgIGZpbGUub2xkUGF0aCxcclxuICAgICAgICAgICAgICAgIGZpbGUubmV3UGF0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGVsZXRlRXhpc3RGaWxlc1doZW5Nb3ZlTm90ZSxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYXR0YWNobWVudHNTdWJmb2xkZXJcclxuICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy51cGRhdGVMaW5rcyAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkRmlsZXMgPSByZXN1bHQucmVuYW1lZEZpbGVzLmNvbmNhdChcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZEZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5saC51cGRhdGVDaGFuZ2VkUGF0aHNJbk5vdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5uZXdQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRGaWxlc1xyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudXBkYXRlTGlua3MpIHtcclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxoLnVwZGF0ZUludGVybmFsTGlua3NJbk1vdmVkTm90ZShcclxuICAgICAgICAgICAgICAgIGZpbGUub2xkUGF0aCxcclxuICAgICAgICAgICAgICAgIGZpbGUubmV3UGF0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MubW92ZUF0dGFjaG1lbnRzV2l0aE5vdGVcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2RlbGV0ZSBjaGlsZCBmb2xkZXJzIChkbyBub3QgZGVsZXRlIHBhcmVudClcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVsZXRlRW1wdHlGb2xkZXJzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5leGlzdHMocGF0aC5kaXJuYW1lKGZpbGUub2xkUGF0aCkpXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIubGlzdChcclxuICAgICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKGZpbGUub2xkUGF0aClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBmb2xkZXIgb2YgbGlzdC5mb2xkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmguZGVsZXRlRW1wdHlGb2xkZXJzKGZvbGRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXBkYXRlQWx0cyA9XHJcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmNoYW5nZU5vdGVCYWNrbGlua3NBbHQgJiYgZmlsZUV4dCA9PSAnLm1kJztcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy51cGRhdGVMaW5rcykge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5saC51cGRhdGVMaW5rc1RvUmVuYW1lZEZpbGUoXHJcbiAgICAgICAgICAgIGZpbGUub2xkUGF0aCxcclxuICAgICAgICAgICAgZmlsZS5uZXdQYXRoLFxyXG4gICAgICAgICAgICB1cGRhdGVBbHRzLFxyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnVzZUJ1aWx0SW5PYnNpZGlhbkxpbmtDYWNoaW5nXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcmVzdWx0ICYmXHJcbiAgICAgICAgICByZXN1bHQubW92ZWRBdHRhY2htZW50cyAmJlxyXG4gICAgICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMubGVuZ3RoID4gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV3IE5vdGljZShcclxuICAgICAgICAgICAgJ01vdmVkICcgK1xyXG4gICAgICAgICAgICAgIHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLmxlbmd0aCArXHJcbiAgICAgICAgICAgICAgJyBhdHRhY2htZW50JyArXHJcbiAgICAgICAgICAgICAgKHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLmxlbmd0aCA+IDEgPyAncycgOiAnJylcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnNpc3RlbnQgQXR0YWNobWVudHMgYW5kIExpbmtzOiBcXG4nICsgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmV3IE5vdGljZSgnRml4aW5nIENvbnNpc3RlbmN5IENvbXBsZXRlJyk7XHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgJ0NvbnNpc3RlbnQgQXR0YWNobWVudHMgYW5kIExpbmtzOlxcbkZpeGluZyBjb25zaXN0ZW5jeSBjb21wbGV0ZSdcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5yZW5hbWluZ0lzQWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKHRoaXMucmVjZW50bHlSZW5hbWVkRmlsZXMgJiYgdGhpcy5yZWNlbnRseVJlbmFtZWRGaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVySWQpO1xyXG4gICAgICB0aGlzLnRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLkhhbmRsZVJlY2VudGx5UmVuYW1lZEZpbGVzKCk7XHJcbiAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBjb2xsZWN0QXR0YWNobWVudHNDdXJyZW50Tm90ZShlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3KSB7XHJcbiAgICBsZXQgbm90ZSA9IHZpZXcuZmlsZTtcclxuICAgIGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZS5wYXRoKSkge1xyXG4gICAgICBuZXcgTm90aWNlKCdOb3RlIHBhdGggaXMgaWdub3JlZCcpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZmguY29sbGVjdEF0dGFjaG1lbnRzRm9yQ2FjaGVkTm90ZShcclxuICAgICAgbm90ZS5wYXRoLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLmF0dGFjaG1lbnRzU3ViZm9sZGVyLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLmRlbGV0ZUV4aXN0RmlsZXNXaGVuTW92ZU5vdGVcclxuICAgICk7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICByZXN1bHQgJiZcclxuICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMgJiZcclxuICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMubGVuZ3RoID4gMFxyXG4gICAgKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubGgudXBkYXRlQ2hhbmdlZFBhdGhzSW5Ob3RlKFxyXG4gICAgICAgIG5vdGUucGF0aCxcclxuICAgICAgICByZXN1bHQubW92ZWRBdHRhY2htZW50c1xyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQubW92ZWRBdHRhY2htZW50cy5sZW5ndGggPT0gMClcclxuICAgICAgbmV3IE5vdGljZSgnTm8gZmlsZXMgZm91bmQgdGhhdCBuZWVkIHRvIGJlIG1vdmVkJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgIG5ldyBOb3RpY2UoXHJcbiAgICAgICAgJ01vdmVkICcgK1xyXG4gICAgICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMubGVuZ3RoICtcclxuICAgICAgICAgICcgYXR0YWNobWVudCcgK1xyXG4gICAgICAgICAgKHJlc3VsdC5tb3ZlZEF0dGFjaG1lbnRzLmxlbmd0aCA+IDEgPyAncycgOiAnJylcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNvbGxlY3RBbGxBdHRhY2htZW50cygpIHtcclxuICAgIGxldCBtb3ZlZEF0dGFjaG1lbnRzQ291bnQgPSAwO1xyXG4gICAgbGV0IHByb2Nlc3NlZE5vdGVzQ291bnQgPSAwO1xyXG5cclxuICAgIGxldCBub3RlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcbiAgICBpZiAobm90ZXMpIHtcclxuICAgICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGF0aElnbm9yZWQobm90ZS5wYXRoKSkgY29udGludWU7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCB0aGlzLmZoLmNvbGxlY3RBdHRhY2htZW50c0ZvckNhY2hlZE5vdGUoXHJcbiAgICAgICAgICBub3RlLnBhdGgsXHJcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmF0dGFjaG1lbnRzU3ViZm9sZGVyLFxyXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWxldGVFeGlzdEZpbGVzV2hlbk1vdmVOb3RlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcmVzdWx0ICYmXHJcbiAgICAgICAgICByZXN1bHQubW92ZWRBdHRhY2htZW50cyAmJlxyXG4gICAgICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMubGVuZ3RoID4gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5saC51cGRhdGVDaGFuZ2VkUGF0aHNJbk5vdGUoXHJcbiAgICAgICAgICAgIG5vdGUucGF0aCxcclxuICAgICAgICAgICAgcmVzdWx0Lm1vdmVkQXR0YWNobWVudHNcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBtb3ZlZEF0dGFjaG1lbnRzQ291bnQgKz0gcmVzdWx0Lm1vdmVkQXR0YWNobWVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb3ZlZEF0dGFjaG1lbnRzQ291bnQgPT0gMClcclxuICAgICAgbmV3IE5vdGljZSgnTm8gZmlsZXMgZm91bmQgdGhhdCBuZWVkIHRvIGJlIG1vdmVkJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgIG5ldyBOb3RpY2UoXHJcbiAgICAgICAgJ01vdmVkICcgK1xyXG4gICAgICAgICAgbW92ZWRBdHRhY2htZW50c0NvdW50ICtcclxuICAgICAgICAgICcgYXR0YWNobWVudCcgK1xyXG4gICAgICAgICAgKG1vdmVkQXR0YWNobWVudHNDb3VudCA+IDEgPyAncycgOiAnJykgK1xyXG4gICAgICAgICAgJyBmcm9tICcgK1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCArXHJcbiAgICAgICAgICAnIG5vdGUnICtcclxuICAgICAgICAgIChwcm9jZXNzZWROb3Rlc0NvdW50ID4gMSA/ICdzJyA6ICcnKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgY29udmVydEFsbEVtYmVkc1BhdGhzVG9SZWxhdGl2ZSgpIHtcclxuICAgIGxldCBjaGFuZ2VkRW1iZWRDb3VudCA9IDA7XHJcbiAgICBsZXQgcHJvY2Vzc2VkTm90ZXNDb3VudCA9IDA7XHJcblxyXG4gICAgbGV0IG5vdGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cclxuICAgIGlmIChub3Rlcykge1xyXG4gICAgICBmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQYXRoSWdub3JlZChub3RlLnBhdGgpKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMubGguY29udmVydEFsbE5vdGVFbWJlZHNQYXRoc1RvUmVsYXRpdmUoXHJcbiAgICAgICAgICBub3RlLnBhdGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjaGFuZ2VkRW1iZWRDb3VudCArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VkRW1iZWRDb3VudCA9PSAwKVxyXG4gICAgICBuZXcgTm90aWNlKCdObyBlbWJlZHMgZm91bmQgdGhhdCBuZWVkIHRvIGJlIGNvbnZlcnRlZCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICBuZXcgTm90aWNlKFxyXG4gICAgICAgICdDb252ZXJ0ZWQgJyArXHJcbiAgICAgICAgICBjaGFuZ2VkRW1iZWRDb3VudCArXHJcbiAgICAgICAgICAnIGVtYmVkJyArXHJcbiAgICAgICAgICAoY2hhbmdlZEVtYmVkQ291bnQgPiAxID8gJ3MnIDogJycpICtcclxuICAgICAgICAgICcgZnJvbSAnICtcclxuICAgICAgICAgIHByb2Nlc3NlZE5vdGVzQ291bnQgK1xyXG4gICAgICAgICAgJyBub3RlJyArXHJcbiAgICAgICAgICAocHJvY2Vzc2VkTm90ZXNDb3VudCA+IDEgPyAncycgOiAnJylcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNvbnZlcnRBbGxMaW5rUGF0aHNUb1JlbGF0aXZlKCkge1xyXG4gICAgbGV0IGNoYW5nZWRMaW5rc0NvdW50ID0gMDtcclxuICAgIGxldCBwcm9jZXNzZWROb3Rlc0NvdW50ID0gMDtcclxuXHJcbiAgICBsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG4gICAgaWYgKG5vdGVzKSB7XHJcbiAgICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGUucGF0aCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5saC5jb252ZXJ0QWxsTm90ZUxpbmtzUGF0aHNUb1JlbGF0aXZlKFxyXG4gICAgICAgICAgbm90ZS5wYXRoXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY2hhbmdlZExpbmtzQ291bnQgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIHByb2Nlc3NlZE5vdGVzQ291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlZExpbmtzQ291bnQgPT0gMClcclxuICAgICAgbmV3IE5vdGljZSgnTm8gbGlua3MgZm91bmQgdGhhdCBuZWVkIHRvIGJlIGNvbnZlcnRlZCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICBuZXcgTm90aWNlKFxyXG4gICAgICAgICdDb252ZXJ0ZWQgJyArXHJcbiAgICAgICAgICBjaGFuZ2VkTGlua3NDb3VudCArXHJcbiAgICAgICAgICAnIGxpbmsnICtcclxuICAgICAgICAgIChjaGFuZ2VkTGlua3NDb3VudCA+IDEgPyAncycgOiAnJykgK1xyXG4gICAgICAgICAgJyBmcm9tICcgK1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCArXHJcbiAgICAgICAgICAnIG5vdGUnICtcclxuICAgICAgICAgIChwcm9jZXNzZWROb3Rlc0NvdW50ID4gMSA/ICdzJyA6ICcnKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVwbGFjZUFsbFdpa2lsaW5rc1dpdGhNYXJrZG93bkxpbmtzKCkge1xyXG4gICAgbGV0IGNoYW5nZWRMaW5rc0NvdW50ID0gMDtcclxuICAgIGxldCBwcm9jZXNzZWROb3Rlc0NvdW50ID0gMDtcclxuXHJcbiAgICBsZXQgbm90ZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG4gICAgaWYgKG5vdGVzKSB7XHJcbiAgICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1BhdGhJZ25vcmVkKG5vdGUucGF0aCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5saC5yZXBsYWNlQWxsTm90ZVdpa2lsaW5rc1dpdGhNYXJrZG93bkxpbmtzKFxyXG4gICAgICAgICAgbm90ZS5wYXRoXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdCAmJiAocmVzdWx0LmxpbmtzLmxlbmd0aCA+IDAgfHwgcmVzdWx0LmVtYmVkcy5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgY2hhbmdlZExpbmtzQ291bnQgKz0gcmVzdWx0LmxpbmtzLmxlbmd0aDtcclxuICAgICAgICAgIGNoYW5nZWRMaW5rc0NvdW50ICs9IHJlc3VsdC5lbWJlZHMubGVuZ3RoO1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VkTGlua3NDb3VudCA9PSAwKVxyXG4gICAgICBuZXcgTm90aWNlKCdObyB3aWtpIGxpbmtzIGZvdW5kIHRoYXQgbmVlZCB0byBiZSByZXBsYWNlZCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICBuZXcgTm90aWNlKFxyXG4gICAgICAgICdSZXBsYWNlZCAnICtcclxuICAgICAgICAgIGNoYW5nZWRMaW5rc0NvdW50ICtcclxuICAgICAgICAgICcgd2lraWxpbmsnICtcclxuICAgICAgICAgIChjaGFuZ2VkTGlua3NDb3VudCA+IDEgPyAncycgOiAnJykgK1xyXG4gICAgICAgICAgJyBmcm9tICcgK1xyXG4gICAgICAgICAgcHJvY2Vzc2VkTm90ZXNDb3VudCArXHJcbiAgICAgICAgICAnIG5vdGUnICtcclxuICAgICAgICAgIChwcm9jZXNzZWROb3Rlc0NvdW50ID4gMSA/ICdzJyA6ICcnKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlRW1wdHlGb2xkZXJzKCkge1xyXG4gICAgdGhpcy5maC5kZWxldGVFbXB0eUZvbGRlcnMoJy8nKTtcclxuICB9XHJcblxyXG5cdGFzeW5jIGNoZWNrQ29uc2lzdGVuY3koKSB7XHJcblx0XHRsZXQgYmFkTGlua3MgPSBhd2FpdCB0aGlzLmxoLmdldEFsbEJhZExpbmtzKCk7XHJcblx0XHRsZXQgYmFkU2VjdGlvbkxpbmtzID0gYXdhaXQgdGhpcy5saC5nZXRBbGxCYWRTZWN0aW9uTGlua3MoKTtcclxuXHRcdGxldCBiYWRFbWJlZHMgPSBhd2FpdCB0aGlzLmxoLmdldEFsbEJhZEVtYmVkcygpO1xyXG5cdFx0bGV0IHdpa2lMaW5rcyA9IGF3YWl0IHRoaXMubGguZ2V0QWxsV2lraUxpbmtzKCk7XHJcblx0XHRsZXQgd2lraUVtYmVkcyA9IGF3YWl0IHRoaXMubGguZ2V0QWxsV2lraUVtYmVkcygpO1xyXG5cclxuICAgIGxldCB0ZXh0ID0gJyc7XHJcblxyXG4gICAgbGV0IGJhZExpbmtzQ291bnQgPSBPYmplY3Qua2V5cyhiYWRMaW5rcykubGVuZ3RoO1xyXG4gICAgbGV0IGJhZEVtYmVkc0NvdW50ID0gT2JqZWN0LmtleXMoYmFkRW1iZWRzKS5sZW5ndGg7XHJcbiAgICBsZXQgYmFkU2VjdGlvbkxpbmtzQ291bnQgPSBPYmplY3Qua2V5cyhiYWRTZWN0aW9uTGlua3MpLmxlbmd0aDtcclxuICAgIGxldCB3aWtpTGlua3NDb3VudCA9IE9iamVjdC5rZXlzKHdpa2lMaW5rcykubGVuZ3RoO1xyXG4gICAgbGV0IHdpa2lFbWJlZHNDb3VudCA9IE9iamVjdC5rZXlzKHdpa2lFbWJlZHMpLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoYmFkTGlua3NDb3VudCA+IDApIHtcclxuICAgICAgdGV4dCArPSAnIyBCYWQgbGlua3MgKCcgKyBiYWRMaW5rc0NvdW50ICsgJyBmaWxlcylcXG4nO1xyXG4gICAgICBmb3IgKGxldCBub3RlIGluIGJhZExpbmtzKSB7XHJcbiAgICAgICAgdGV4dCArPVxyXG4gICAgICAgICAgJ1snICsgbm90ZSArICddKCcgKyBVdGlscy5ub3JtYWxpemVQYXRoRm9yTGluayhub3RlKSArICcpOiAnICsgJ1xcbic7XHJcbiAgICAgICAgZm9yIChsZXQgbGluayBvZiBiYWRMaW5rc1tub3RlXSkge1xyXG4gICAgICAgICAgdGV4dCArPVxyXG4gICAgICAgICAgICAnLSAobGluZSAnICtcclxuICAgICAgICAgICAgKGxpbmsucG9zaXRpb24uc3RhcnQubGluZSArIDEpICtcclxuICAgICAgICAgICAgJyk6IGAnICtcclxuICAgICAgICAgICAgbGluay5saW5rICtcclxuICAgICAgICAgICAgJ2BcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0ICs9ICdcXG5cXG4nO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZXh0ICs9ICcjIEJhZCBsaW5rcyBcXG4nO1xyXG4gICAgICB0ZXh0ICs9ICdObyBwcm9ibGVtcyBmb3VuZFxcblxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhZFNlY3Rpb25MaW5rc0NvdW50ID4gMCkge1xyXG4gICAgICB0ZXh0ICs9XHJcbiAgICAgICAgJ1xcblxcbiMgQmFkIG5vdGUgbGluayBzZWN0aW9ucyAoJyArIGJhZFNlY3Rpb25MaW5rc0NvdW50ICsgJyBmaWxlcylcXG4nO1xyXG4gICAgICBmb3IgKGxldCBub3RlIGluIGJhZFNlY3Rpb25MaW5rcykge1xyXG4gICAgICAgIHRleHQgKz1cclxuICAgICAgICAgICdbJyArIG5vdGUgKyAnXSgnICsgVXRpbHMubm9ybWFsaXplUGF0aEZvckxpbmsobm90ZSkgKyAnKTogJyArICdcXG4nO1xyXG4gICAgICAgIGZvciAobGV0IGxpbmsgb2YgYmFkU2VjdGlvbkxpbmtzW25vdGVdKSB7XHJcbiAgICAgICAgICBsZXQgbGkgPSB0aGlzLmxoLnNwbGl0TGlua1RvUGF0aEFuZFNlY3Rpb24obGluay5saW5rKTtcclxuICAgICAgICAgIGxldCBzZWN0aW9uID0gVXRpbHMubm9ybWFsaXplTGlua1NlY3Rpb24obGkuc2VjdGlvbik7XHJcbiAgICAgICAgICB0ZXh0ICs9XHJcbiAgICAgICAgICAgICctIChsaW5lICcgK1xyXG4gICAgICAgICAgICAobGluay5wb3NpdGlvbi5zdGFydC5saW5lICsgMSkgK1xyXG4gICAgICAgICAgICAnKTogYCcgK1xyXG4gICAgICAgICAgICBsaS5saW5rICtcclxuICAgICAgICAgICAgJyMnICtcclxuICAgICAgICAgICAgc2VjdGlvbiArXHJcbiAgICAgICAgICAgICdgXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCArPSAnXFxuXFxuJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCArPSAnXFxuXFxuIyBCYWQgbm90ZSBsaW5rIHNlY3Rpb25zXFxuJztcclxuICAgICAgdGV4dCArPSAnTm8gcHJvYmxlbXMgZm91bmRcXG5cXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiYWRFbWJlZHNDb3VudCA+IDApIHtcclxuICAgICAgdGV4dCArPSAnXFxuXFxuIyBCYWQgZW1iZWRzICgnICsgYmFkRW1iZWRzQ291bnQgKyAnIGZpbGVzKVxcbic7XHJcbiAgICAgIGZvciAobGV0IG5vdGUgaW4gYmFkRW1iZWRzKSB7XHJcbiAgICAgICAgdGV4dCArPVxyXG4gICAgICAgICAgJ1snICsgbm90ZSArICddKCcgKyBVdGlscy5ub3JtYWxpemVQYXRoRm9yTGluayhub3RlKSArICcpOiAnICsgJ1xcbic7XHJcbiAgICAgICAgZm9yIChsZXQgbGluayBvZiBiYWRFbWJlZHNbbm90ZV0pIHtcclxuICAgICAgICAgIHRleHQgKz1cclxuICAgICAgICAgICAgJy0gKGxpbmUgJyArXHJcbiAgICAgICAgICAgIChsaW5rLnBvc2l0aW9uLnN0YXJ0LmxpbmUgKyAxKSArXHJcbiAgICAgICAgICAgICcpOiBgJyArXHJcbiAgICAgICAgICAgIGxpbmsubGluayArXHJcbiAgICAgICAgICAgICdgXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCArPSAnXFxuXFxuJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCArPSAnXFxuXFxuIyBCYWQgZW1iZWRzIFxcbic7XHJcbiAgICAgIHRleHQgKz0gJ05vIHByb2JsZW1zIGZvdW5kXFxuXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2lraUxpbmtzQ291bnQgPiAwKSB7XHJcbiAgICAgIHRleHQgKz0gJyMgV2lraSBsaW5rcyAoJyArIHdpa2lMaW5rc0NvdW50ICsgJyBmaWxlcylcXG4nO1xyXG4gICAgICBmb3IgKGxldCBub3RlIGluIHdpa2lMaW5rcykge1xyXG4gICAgICAgIHRleHQgKz1cclxuICAgICAgICAgICdbJyArIG5vdGUgKyAnXSgnICsgVXRpbHMubm9ybWFsaXplUGF0aEZvckxpbmsobm90ZSkgKyAnKTogJyArICdcXG4nO1xyXG4gICAgICAgIGZvciAobGV0IGxpbmsgb2Ygd2lraUxpbmtzW25vdGVdKSB7XHJcbiAgICAgICAgICB0ZXh0ICs9XHJcbiAgICAgICAgICAgICctIChsaW5lICcgK1xyXG4gICAgICAgICAgICAobGluay5wb3NpdGlvbi5zdGFydC5saW5lICsgMSkgK1xyXG4gICAgICAgICAgICAnKTogYCcgK1xyXG4gICAgICAgICAgICBsaW5rLm9yaWdpbmFsICtcclxuICAgICAgICAgICAgJ2BcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0ICs9ICdcXG5cXG4nO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZXh0ICs9ICcjIFdpa2kgbGlua3MgXFxuJztcclxuICAgICAgdGV4dCArPSAnTm8gcHJvYmxlbXMgZm91bmRcXG5cXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aWtpRW1iZWRzQ291bnQgPiAwKSB7XHJcbiAgICAgIHRleHQgKz0gJ1xcblxcbiMgV2lraSBlbWJlZHMgKCcgKyB3aWtpRW1iZWRzQ291bnQgKyAnIGZpbGVzKVxcbic7XHJcbiAgICAgIGZvciAobGV0IG5vdGUgaW4gd2lraUVtYmVkcykge1xyXG4gICAgICAgIHRleHQgKz1cclxuICAgICAgICAgICdbJyArIG5vdGUgKyAnXSgnICsgVXRpbHMubm9ybWFsaXplUGF0aEZvckxpbmsobm90ZSkgKyAnKTogJyArICdcXG4nO1xyXG4gICAgICAgIGZvciAobGV0IGxpbmsgb2Ygd2lraUVtYmVkc1tub3RlXSkge1xyXG4gICAgICAgICAgdGV4dCArPVxyXG4gICAgICAgICAgICAnLSAobGluZSAnICtcclxuICAgICAgICAgICAgKGxpbmsucG9zaXRpb24uc3RhcnQubGluZSArIDEpICtcclxuICAgICAgICAgICAgJyk6IGAnICtcclxuICAgICAgICAgICAgbGluay5vcmlnaW5hbCArXHJcbiAgICAgICAgICAgICdgXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCArPSAnXFxuXFxuJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCArPSAnXFxuXFxuIyBXaWtpIGVtYmVkcyBcXG4nO1xyXG4gICAgICB0ZXh0ICs9ICdObyBwcm9ibGVtcyBmb3VuZFxcblxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5vdGVQYXRoID0gdGhpcy5zZXR0aW5ncy5jb25zaXN0ZW5jeVJlcG9ydEZpbGU7XHJcbiAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLndyaXRlKG5vdGVQYXRoLCB0ZXh0KTtcclxuXHJcbiAgICBsZXQgZmlsZU9wZW5lZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVBbGxMZWF2ZXMoKGxlYWYpID0+IHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGxlYWYuZ2V0RGlzcGxheVRleHQoKSAhPSAnJyAmJlxyXG4gICAgICAgIG5vdGVQYXRoLnN0YXJ0c1dpdGgobGVhZi5nZXREaXNwbGF5VGV4dCgpKVxyXG4gICAgICApIHtcclxuICAgICAgICBmaWxlT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFmaWxlT3BlbmVkKSB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KG5vdGVQYXRoLCAnLycsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlb3JnYW5pemVWYXVsdCgpIHtcclxuICAgIGF3YWl0IHRoaXMucmVwbGFjZUFsbFdpa2lsaW5rc1dpdGhNYXJrZG93bkxpbmtzKCk7XHJcbiAgICBhd2FpdCB0aGlzLmNvbnZlcnRBbGxFbWJlZHNQYXRoc1RvUmVsYXRpdmUoKTtcclxuICAgIGF3YWl0IHRoaXMuY29udmVydEFsbExpbmtQYXRoc1RvUmVsYXRpdmUoKTtcclxuICAgIC8vLSBSZW5hbWUgYWxsIGF0dGFjaG1lbnRzICh1c2luZyBVbmlxdWUgYXR0YWNobWVudHMsIG9wdGlvbmFsKVxyXG4gICAgYXdhaXQgdGhpcy5jb2xsZWN0QWxsQXR0YWNobWVudHMoKTtcclxuICAgIGF3YWl0IHRoaXMuZGVsZXRlRW1wdHlGb2xkZXJzKCk7XHJcbiAgICBuZXcgTm90aWNlKCdSZW9yZ2FuaXphdGlvbiBvZiB0aGUgdmF1bHQgY29tcGxldGVkJyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5saCA9IG5ldyBMaW5rc0hhbmRsZXIoXHJcbiAgICAgIHRoaXMuYXBwLFxyXG4gICAgICAnQ29uc2lzdGVudCBBdHRhY2htZW50cyBhbmQgTGlua3M6ICcsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MuaWdub3JlRm9sZGVycyxcclxuICAgICAgdGhpcy5zZXR0aW5ncy5pZ25vcmVGaWxlc1JlZ2V4XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZmggPSBuZXcgRmlsZXNIYW5kbGVyKFxyXG4gICAgICB0aGlzLmFwcCxcclxuICAgICAgdGhpcy5saCxcclxuICAgICAgJ0NvbnNpc3RlbnQgQXR0YWNobWVudHMgYW5kIExpbmtzOiAnLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLmlnbm9yZUZvbGRlcnMsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MuaWdub3JlRmlsZXNSZWdleFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwibm9ybWFsaXplUGF0aCIsIlRGaWxlIiwiUGx1Z2luIiwiTm90aWNlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW9HQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBZ01EO0FBQ3VCLE9BQU8sZUFBZSxLQUFLLFVBQVUsR0FBRyxlQUFlLEdBQUcsVUFBVSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUN2SCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUNyRjs7QUM1U08sTUFBTSxnQkFBZ0IsR0FBbUI7QUFDNUMsSUFBQSx1QkFBdUIsRUFBRSxJQUFJO0FBQzdCLElBQUEseUJBQXlCLEVBQUUsSUFBSTtBQUMvQixJQUFBLFdBQVcsRUFBRSxJQUFJO0FBQ2pCLElBQUEsa0JBQWtCLEVBQUUsSUFBSTtBQUN4QixJQUFBLDRCQUE0QixFQUFFLElBQUk7QUFDbEMsSUFBQSxzQkFBc0IsRUFBRSxLQUFLO0FBQzdCLElBQUEsYUFBYSxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUN0QyxXQUFXLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztJQUMxQyxnQkFBZ0IsRUFBRSxDQUFDLHlCQUF5QixDQUFDO0FBQzdDLElBQUEsb0JBQW9CLEVBQUUsRUFBRTtBQUN4QixJQUFBLHFCQUFxQixFQUFFLHVCQUF1QjtBQUM5QyxJQUFBLDZCQUE2QixFQUFFLEtBQUs7Q0FDdkMsQ0FBQTtBQUVLLE1BQU8sVUFBVyxTQUFRQSx5QkFBZ0IsQ0FBQTtJQUc1QyxXQUFZLENBQUEsR0FBUSxFQUFFLE1BQXFDLEVBQUE7QUFDdkQsUUFBQSxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDeEI7SUFFRCxPQUFPLEdBQUE7QUFDSCxRQUFBLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLDZDQUE2QyxFQUFFLENBQUMsQ0FBQztRQUdwRixJQUFJQyxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsNEJBQTRCLENBQUM7YUFDckMsT0FBTyxDQUFDLHlJQUF5SSxDQUFDO2FBQ2xKLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUc7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO0FBQ3JELFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMvQixTQUFDLENBQ0EsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBRzlELElBQUlBLGdCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQzthQUM5QyxPQUFPLENBQUMseUdBQXlHLENBQUM7YUFDbEgsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBRztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7QUFDdkQsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQy9CLFNBQUMsQ0FDQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7UUFHaEUsSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGNBQWMsQ0FBQzthQUN2QixPQUFPLENBQUMsNkZBQTZGLENBQUM7YUFDdEcsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBRztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pDLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMvQixTQUFDLENBQ0EsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUVsRCxJQUFJQSxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsc0JBQXNCLENBQUM7YUFDL0IsT0FBTyxDQUFDLHlFQUF5RSxDQUFDO2FBQ2xGLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUc7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2hELFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMvQixTQUFDLENBQ0EsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBR3pELElBQUlBLGdCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQzthQUNwRCxPQUFPLENBQUMscUtBQXFLLENBQUM7YUFDOUssU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBRztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7QUFDMUQsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQy9CLFNBQUMsQ0FDQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7UUFHbkUsSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLHFDQUFxQyxDQUFDO2FBQzlDLE9BQU8sQ0FBQywrSkFBK0osQ0FBQzthQUN4SyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFHO1lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztBQUNwRCxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDL0IsU0FBQyxDQUNBLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUk3RCxJQUFJQSxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsZ0JBQWdCLENBQUM7YUFDekIsT0FBTyxDQUFDLHVFQUF1RSxDQUFDO0FBQ2hGLGFBQUEsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFO2FBQ2hCLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztBQUMxQyxhQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZELGFBQUEsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFJO1lBQ2hCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztBQUMzQyxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDLENBQUM7UUFFWixJQUFJQSxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsY0FBYyxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyxtRUFBbUUsQ0FBQztBQUM1RSxhQUFBLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRTthQUNoQixjQUFjLENBQUMsK0JBQStCLENBQUM7QUFDL0MsYUFBQSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxhQUFBLFFBQVEsQ0FBQyxDQUFDLEtBQUssS0FBSTtZQUNoQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEUsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRVosSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLHNCQUFzQixDQUFDO2FBQy9CLE9BQU8sQ0FBQyxtUUFBbVEsQ0FBQztBQUM1USxhQUFBLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRTthQUNaLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQzthQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUM7QUFDbkQsYUFBQSxRQUFRLENBQUMsQ0FBQyxLQUFLLEtBQUk7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0FBQ2xELFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUM5QixDQUFDLENBQUMsQ0FBQztRQUdaLElBQUlBLGdCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQzthQUN0QyxPQUFPLENBQUMsMERBQTBELENBQUM7QUFDbkUsYUFBQSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUU7YUFDWixjQUFjLENBQUMsZ0NBQWdDLENBQUM7YUFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO0FBQ3BELGFBQUEsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFJO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztBQUNuRCxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDLENBQUM7UUFHWixJQUFJQSxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsa0VBQWtFLENBQUM7YUFDM0UsT0FBTyxDQUFDLDZJQUE2SSxDQUFDO2FBQ3RKLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUc7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsNkJBQTZCLEdBQUcsS0FBSyxDQUFDO0FBQzNELFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMvQixTQUFDLENBQ0EsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFO0FBRUQsSUFBQSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUE7QUFDMUIsUUFBQSxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksR0FBR0Msc0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4RDtBQUNKOztNQ3pLWSxLQUFLLENBQUE7SUFFakIsT0FBYSxLQUFLLENBQUMsRUFBVSxFQUFBOztBQUM1QixZQUFBLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RCxDQUFBLENBQUE7QUFBQSxLQUFBO0lBR0QsT0FBTyxvQkFBb0IsQ0FBQyxJQUFZLEVBQUE7UUFDdkMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ1o7SUFHRCxPQUFPLG9CQUFvQixDQUFDLElBQVksRUFBQTtRQUN2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELE9BQU8sb0JBQW9CLENBQUMsT0FBZSxFQUFBO0FBQzFDLFFBQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixRQUFBLE9BQU8sT0FBTyxDQUFDO0tBQ2Y7SUFFRCxPQUFhLFlBQVksQ0FBQyxVQUEwQixFQUFBOztZQUNuRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXZDLFlBQUEsT0FBTyxJQUFJLEVBQUU7Z0JBQ1osTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsZ0JBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixvQkFBQSxPQUFPLEtBQUssQ0FBQztBQUNiLGlCQUFBO0FBRUQsZ0JBQUEsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLGFBQUE7U0FDRCxDQUFBLENBQUE7QUFBQSxLQUFBO0lBRUQsT0FBTyxPQUFPLENBQUMsVUFBMEIsRUFBQTtRQUN4QyxJQUFJLFVBQVUsWUFBWUMsY0FBSyxFQUFFO0FBQ2hDLFlBQUEsT0FBTyxVQUFVLENBQUM7QUFDbEIsU0FBQTtRQUVELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNsQixNQUFNLENBQUEsS0FBQSxFQUFRLFVBQVUsQ0FBQSxlQUFBLENBQWlCLENBQUM7QUFDMUMsU0FBQTtBQUVELFFBQUEsSUFBSSxFQUFFLFlBQVksWUFBWUEsY0FBSyxDQUFDLEVBQUU7WUFDckMsTUFBTSxDQUFBLEVBQUcsVUFBVSxDQUFBLGNBQUEsQ0FBZ0IsQ0FBQztBQUNwQyxTQUFBO0FBRUQsUUFBQSxPQUFPLFlBQVksQ0FBQztLQUNwQjtBQUNEOztNQ3hEWSxJQUFJLENBQUE7QUFDYixJQUFBLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBZSxFQUFBO0FBQzFCLFFBQUEsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUM7QUFDdEIsWUFBQSxPQUFPLEdBQUcsQ0FBQztBQUNmLFFBQUEsSUFBSSxNQUFNLENBQUM7QUFDWCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZDLFlBQUEsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUEsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDaEIsSUFBSSxNQUFNLEtBQUssU0FBUztvQkFDcEIsTUFBTSxHQUFHLEdBQUcsQ0FBQzs7QUFFYixvQkFBQSxNQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMzQixhQUFBO0FBQ0osU0FBQTtRQUNELElBQUksTUFBTSxLQUFLLFNBQVM7QUFDcEIsWUFBQSxPQUFPLEdBQUcsQ0FBQztBQUNmLFFBQUEsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsT0FBTyxPQUFPLENBQUMsSUFBWSxFQUFBO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7QUFBRSxZQUFBLE9BQU8sR0FBRyxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBQSxJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBRSxPQUFPO0FBQ2hDLFFBQUEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdkMsWUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFBLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDZixHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNSLE1BQU07QUFDVCxpQkFBQTtBQUNKLGFBQUE7QUFBTSxpQkFBQTs7Z0JBRUgsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN4QixhQUFBO0FBQ0osU0FBQTtRQUVELElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQztZQUFFLE9BQU8sT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDM0MsUUFBQSxJQUFJLE9BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQztBQUFFLFlBQUEsT0FBTyxJQUFJLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM3QjtBQUVELElBQUEsT0FBTyxRQUFRLENBQUMsSUFBWSxFQUFFLEdBQVksRUFBQTtBQUN0QyxRQUFBLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO0FBQUUsWUFBQSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFekcsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBQSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFBLElBQUksQ0FBQyxDQUFDO0FBRU4sUUFBQSxJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2xFLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFJO0FBQUUsZ0JBQUEsT0FBTyxFQUFFLENBQUM7QUFDMUQsWUFBQSxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1QixZQUFBLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBQSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLGdCQUFBLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUTs7O29CQUduQixJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2Ysd0JBQUEsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2QsTUFBTTtBQUNULHFCQUFBO0FBQ0osaUJBQUE7QUFBTSxxQkFBQTtBQUNILG9CQUFBLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLEVBQUU7Ozt3QkFHekIsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUNyQix3QkFBQSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLHFCQUFBO29CQUNELElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTs7d0JBRWIsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNqQyw0QkFBQSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7Z0NBR2pCLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWCw2QkFBQTtBQUNKLHlCQUFBO0FBQU0sNkJBQUE7Ozs0QkFHSCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ1osR0FBRyxHQUFHLGdCQUFnQixDQUFDO0FBQzFCLHlCQUFBO0FBQ0oscUJBQUE7QUFDSixpQkFBQTtBQUNKLGFBQUE7WUFFRCxJQUFJLEtBQUssS0FBSyxHQUFHO2dCQUFFLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQztpQkFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFBRSxnQkFBQSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNsRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLFNBQUE7QUFBTSxhQUFBO0FBQ0gsWUFBQSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFROzs7b0JBR2pDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDZix3QkFBQSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDZCxNQUFNO0FBQ1QscUJBQUE7QUFDSixpQkFBQTtBQUFNLHFCQUFBLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7b0JBR25CLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDckIsb0JBQUEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixpQkFBQTtBQUNKLGFBQUE7WUFFRCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFBRSxnQkFBQSxPQUFPLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLFNBQUE7S0FDSjtJQUVELE9BQU8sT0FBTyxDQUFDLElBQVksRUFBQTtBQUN2QixRQUFBLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7UUFHeEIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsWUFBQSxJQUFJLElBQUksS0FBSyxFQUFFLFFBQVE7OztnQkFHbkIsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNmLG9CQUFBLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixNQUFNO0FBQ1QsaUJBQUE7Z0JBQ0QsU0FBUztBQUNaLGFBQUE7QUFDRCxZQUFBLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7Z0JBR1osWUFBWSxHQUFHLEtBQUssQ0FBQztBQUNyQixnQkFBQSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLGFBQUE7QUFDRCxZQUFBLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUTs7Z0JBRW5CLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQztvQkFDZixRQUFRLEdBQUcsQ0FBQyxDQUFDO3FCQUNaLElBQUksV0FBVyxLQUFLLENBQUM7b0JBQ3RCLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDdkIsYUFBQTtBQUFNLGlCQUFBLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7Z0JBR3hCLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQixhQUFBO0FBQ0osU0FBQTtRQUVELElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7O0FBRTdCLFlBQUEsV0FBVyxLQUFLLENBQUM7O0FBRWpCLFlBQUEsV0FBVyxLQUFLLENBQUMsSUFBSSxRQUFRLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxRQUFRLEtBQUssU0FBUyxHQUFHLENBQUMsRUFBRTtBQUN6RSxZQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ2IsU0FBQTtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDcEM7SUFJRCxPQUFPLEtBQUssQ0FBQyxJQUFZLEVBQUE7UUFFckIsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUM3RCxRQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQUUsWUFBQSxPQUFPLEdBQUcsQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFFBQUEsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQUUsT0FBTztBQUNuQyxRQUFBLElBQUksS0FBSyxDQUFDO0FBQ1YsUUFBQSxJQUFJLFVBQVUsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDZixLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsU0FBQTtBQUFNLGFBQUE7WUFDSCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsU0FBQTtBQUNELFFBQUEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBQSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7O1FBSXhCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7QUFHcEIsUUFBQSxPQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFBLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUTs7O2dCQUduQixJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2Ysb0JBQUEsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE1BQU07QUFDVCxpQkFBQTtnQkFDRCxTQUFTO0FBQ1osYUFBQTtBQUNELFlBQUEsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7OztnQkFHWixZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGdCQUFBLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsYUFBQTtBQUNELFlBQUEsSUFBSSxJQUFJLEtBQUssRUFBRSxRQUFROztnQkFFbkIsSUFBSSxRQUFRLEtBQUssQ0FBQyxDQUFDO29CQUFFLFFBQVEsR0FBRyxDQUFDLENBQUM7cUJBQU0sSUFBSSxXQUFXLEtBQUssQ0FBQztvQkFBRSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ2xGLGFBQUE7QUFBTSxpQkFBQSxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBRTs7O2dCQUd4QixXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEIsYUFBQTtBQUNKLFNBQUE7UUFFRCxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUU3QixZQUFBLFdBQVcsS0FBSyxDQUFDOztBQUVqQixZQUFBLFdBQVcsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksUUFBUSxLQUFLLFNBQVMsR0FBRyxDQUFDLEVBQUU7QUFDekUsWUFBQSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNaLGdCQUFBLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxVQUFVO0FBQUUsb0JBQUEsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUFNLG9CQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0SSxhQUFBO0FBQ0osU0FBQTtBQUFNLGFBQUE7QUFDSCxZQUFBLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQy9CLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakMsYUFBQTtBQUFNLGlCQUFBO2dCQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzNDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDekMsYUFBQTtZQUNELEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkMsU0FBQTtRQUVELElBQUksU0FBUyxHQUFHLENBQUM7QUFBRSxZQUFBLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQU0sYUFBQSxJQUFJLFVBQVU7QUFBRSxZQUFBLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBRTlGLFFBQUEsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUtELE9BQU8sY0FBYyxDQUFDLElBQVksRUFBQTtBQUU5QixRQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQUUsWUFBQSxPQUFPLEdBQUcsQ0FBQztBQUVsQyxRQUFBLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQ2pELFFBQUEsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPOztRQUd0RSxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXBELFFBQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2pELFFBQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxpQkFBaUI7WUFBRSxJQUFJLElBQUksR0FBRyxDQUFDO0FBRXRELFFBQUEsSUFBSSxVQUFVO1lBQUUsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLFFBQUEsT0FBTyxJQUFJLENBQUM7S0FDZjtBQUVELElBQUEsT0FBTyxvQkFBb0IsQ0FBQyxJQUFZLEVBQUUsY0FBdUIsRUFBQTtRQUM3RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMxQixRQUFBLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUEsSUFBSSxJQUFJLENBQUM7QUFDVCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLFlBQUEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU07QUFDZixnQkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixpQkFBQSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUNoQixNQUFNOztBQUVOLGdCQUFBLElBQUksR0FBRyxFQUFFLE9BQU87QUFDcEIsWUFBQSxJQUFJLElBQUksS0FBSyxFQUFFLFFBQVE7Z0JBQ25CLElBQUksU0FBUyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRSxDQUV0QztxQkFBTSxJQUFJLFNBQVMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7QUFDMUMsb0JBQUEsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRO0FBQ3pJLHdCQUFBLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ2hCLElBQUksY0FBYyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsNEJBQUEsSUFBSSxjQUFjLEtBQUssR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbkMsZ0NBQUEsSUFBSSxjQUFjLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0NBQ3ZCLEdBQUcsR0FBRyxFQUFFLENBQUM7b0NBQ1QsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGlDQUFBO0FBQU0scUNBQUE7b0NBQ0gsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLG9DQUFBLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0QsaUNBQUE7Z0NBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQztnQ0FDZCxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dDQUNULFNBQVM7QUFDWiw2QkFBQTtBQUNKLHlCQUFBOzZCQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQzdDLEdBQUcsR0FBRyxFQUFFLENBQUM7NEJBQ1QsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDOzRCQUN0QixTQUFTLEdBQUcsQ0FBQyxDQUFDOzRCQUNkLElBQUksR0FBRyxDQUFDLENBQUM7NEJBQ1QsU0FBUztBQUNaLHlCQUFBO0FBQ0oscUJBQUE7QUFDRCxvQkFBQSxJQUFJLGNBQWMsRUFBRTtBQUNoQix3QkFBQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQzs0QkFDZCxHQUFHLElBQUksS0FBSyxDQUFDOzs0QkFFYixHQUFHLEdBQUcsSUFBSSxDQUFDO3dCQUNmLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUN6QixxQkFBQTtBQUNKLGlCQUFBO0FBQU0scUJBQUE7QUFDSCxvQkFBQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUNkLHdCQUFBLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzt3QkFFMUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxvQkFBQSxpQkFBaUIsR0FBRyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUN6QyxpQkFBQTtnQkFDRCxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLElBQUksR0FBRyxDQUFDLENBQUM7QUFDWixhQUFBO2lCQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsVUFBVSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekMsZ0JBQUEsRUFBRSxJQUFJLENBQUM7QUFDVixhQUFBO0FBQU0saUJBQUE7Z0JBQ0gsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2IsYUFBQTtBQUNKLFNBQUE7QUFDRCxRQUFBLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7QUFFRCxJQUFBLE9BQU8sWUFBWSxDQUFDLEdBQUcsSUFBYyxFQUFBO1FBQ2pDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUM3QixRQUFBLElBQUksR0FBRyxDQUFDO0FBRVIsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdELFlBQUEsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ04sZ0JBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLGlCQUFBO2dCQUNELElBQUksR0FBRyxLQUFLLFNBQVM7QUFDakIsb0JBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNkLGFBQUE7O0FBSUQsWUFBQSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixTQUFTO0FBQ1osYUFBQTtBQUVELFlBQUEsWUFBWSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDO1lBQ3pDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQ3RELFNBQUE7Ozs7UUFNRCxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFMUUsUUFBQSxJQUFJLGdCQUFnQixFQUFFO0FBQ2xCLFlBQUEsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3ZCLE9BQU8sR0FBRyxHQUFHLFlBQVksQ0FBQzs7QUFFMUIsZ0JBQUEsT0FBTyxHQUFHLENBQUM7QUFDbEIsU0FBQTtBQUFNLGFBQUEsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxZQUFBLE9BQU8sWUFBWSxDQUFDO0FBQ3ZCLFNBQUE7QUFBTSxhQUFBO0FBQ0gsWUFBQSxPQUFPLEdBQUcsQ0FBQztBQUNkLFNBQUE7S0FDSjtBQUVELElBQUEsT0FBTyxRQUFRLENBQUMsSUFBWSxFQUFFLEVBQVUsRUFBQTtRQUVwQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQUUsWUFBQSxPQUFPLEVBQUUsQ0FBQztBQUUzQixRQUFBLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFFBQUEsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0IsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUFFLFlBQUEsT0FBTyxFQUFFLENBQUM7O1FBRzNCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixPQUFPLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFO1lBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxNQUFNO0FBQ2IsU0FBQTtBQUNELFFBQUEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMxQixRQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxTQUFTLENBQUM7O1FBR2xDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixPQUFPLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBQ25DLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUM3QixNQUFNO0FBQ2IsU0FBQTtBQUNELFFBQUEsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUN0QixRQUFBLElBQUksS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUM7O0FBRzVCLFFBQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQy9DLFFBQUEsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsUUFBQSxPQUFPLENBQUMsSUFBSSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUNkLElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRTtBQUNoQixvQkFBQSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUTs7O3dCQUd6QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxxQkFBQTt5QkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Ozt3QkFHaEIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQyxxQkFBQTtBQUNKLGlCQUFBO3FCQUFNLElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRTtBQUN6QixvQkFBQSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUTs7O3dCQUc3QyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLHFCQUFBO3lCQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTs7O3dCQUdoQixhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLHFCQUFBO0FBQ0osaUJBQUE7Z0JBQ0QsTUFBTTtBQUNULGFBQUE7WUFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLFFBQVEsS0FBSyxNQUFNO2dCQUNuQixNQUFNO0FBQ0wsaUJBQUEsSUFBSSxRQUFRLEtBQUssRUFBRTtnQkFDcEIsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN6QixTQUFBO1FBRUQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDOzs7QUFHYixRQUFBLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdkQsWUFBQSxJQUFJLENBQUMsS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVE7QUFDbEQsZ0JBQUEsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQ2hCLEdBQUcsSUFBSSxJQUFJLENBQUM7O29CQUVaLEdBQUcsSUFBSSxLQUFLLENBQUM7QUFDcEIsYUFBQTtBQUNKLFNBQUE7OztBQUlELFFBQUEsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDZCxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsQ0FBQztBQUM5QyxhQUFBO1lBQ0QsT0FBTyxJQUFJLGFBQWEsQ0FBQztZQUN6QixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUM3QixnQkFBQSxFQUFFLE9BQU8sQ0FBQztBQUNkLFlBQUEsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLFNBQUE7S0FDSjtBQUNKOztBQ3JhRDtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0EsTUFBTSx5QkFBeUIsR0FBRyw0Q0FBNEMsQ0FBQTtBQUM5RSxNQUFNLGtCQUFrQixHQUFHLDhEQUE4RCxDQUFDO0FBQzFGLE1BQU0sbUJBQW1CLEdBQUcsOENBQThDLENBQUE7QUFFMUUsTUFBTSxxQkFBcUIsR0FBRyxnQ0FBZ0MsQ0FBQTtBQUM5RCxNQUFNLGNBQWMsR0FBRyx1Q0FBdUMsQ0FBQztBQUMvRCxNQUFNLGVBQWUsR0FBRyxrQ0FBa0MsQ0FBQTtBQUUxRCxNQUFNLHdCQUF3QixHQUFHLDJDQUEyQyxDQUFBO0FBQzVFLE1BQU0saUJBQWlCLEdBQUcsa0RBQWtELENBQUM7TUFRaEUsWUFBWSxDQUFBO0lBRXhCLFdBQ1MsQ0FBQSxHQUFRLEVBQ1IsZ0JBQTJCLEdBQUEsRUFBRSxFQUM3QixhQUEwQixHQUFBLEVBQUUsRUFDNUIsZ0JBQUEsR0FBNkIsRUFBRSxFQUFBO1FBSC9CLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUFLO1FBQ1IsSUFBZ0IsQ0FBQSxnQkFBQSxHQUFoQixnQkFBZ0IsQ0FBYTtRQUM3QixJQUFhLENBQUEsYUFBQSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixJQUFnQixDQUFBLGdCQUFBLEdBQWhCLGdCQUFnQixDQUFlO0tBQ25DO0FBRUwsSUFBQSxhQUFhLENBQUMsSUFBWSxFQUFBO0FBQ3pCLFFBQUEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztBQUN4QixZQUFBLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTFCLFFBQUEsS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RDLFlBQUEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVCLGdCQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ1osYUFBQTtBQUNELFNBQUE7QUFFRCxRQUFBLEtBQUssSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQzVDLFlBQUEsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3pCLGdCQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ1osYUFBQTtBQUNELFNBQUE7S0FDRDtBQUVELElBQUEsMkJBQTJCLENBQUMsSUFBWSxFQUFBO1FBQ3ZDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMvQyxRQUFRLFFBQVEsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7S0FDaEQ7QUFFRCxJQUFBLDBCQUEwQixDQUFDLElBQVksRUFBQTtRQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUMsUUFBUSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO0tBQ2hEO0FBRUQsSUFBQSxpQ0FBaUMsQ0FBQyxJQUFZLEVBQUE7UUFDN0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELFFBQVEsUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztLQUNoRDtBQUVELElBQUEsdUJBQXVCLENBQUMsSUFBWSxFQUFBO1FBQ25DLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsUUFBUSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO0tBQ2hEO0FBRUQsSUFBQSxzQkFBc0IsQ0FBQyxJQUFZLEVBQUE7UUFDbEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxQyxRQUFRLFFBQVEsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7S0FDaEQ7QUFFRCxJQUFBLDZCQUE2QixDQUFDLElBQVksRUFBQTtRQUN6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDakQsUUFBUSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO0tBQ2hEO0FBR0QsSUFBQSxhQUFhLENBQUMsSUFBWSxFQUFFLGNBQXNCLEVBQUUsbUJBQTRCLElBQUksRUFBQTtRQUNuRixJQUFJLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNqRCxRQUFBLElBQUksZ0JBQWdCLEVBQUU7QUFDckIsWUFBQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN6RSxTQUFBO1FBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM3RCxRQUFBLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQztBQUdELElBQUEsYUFBYSxDQUFDLElBQVksRUFBQTtBQUN6QixRQUFBLElBQUksR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBVSxDQUFDO0tBQ3REO0lBR0Qsa0JBQWtCLENBQUMsSUFBWSxFQUFFLGNBQXNCLEVBQUE7UUFDdEQsSUFBSSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakQsUUFBQSxJQUFJLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFFBQUEsY0FBYyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUU1RCxRQUFBLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoRixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUU3QyxRQUFBLFFBQVEsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsUUFBQSxPQUFPLFFBQVEsQ0FBQztLQUNoQjtBQUdLLElBQUEsdUJBQXVCLENBQUMsUUFBZ0IsRUFBQTs7WUFDN0MsSUFBSSxRQUFRLEdBQXlDLEVBQUUsQ0FBQztZQUN4RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBRTlDLFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2QixvQkFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDeEIsU0FBUztBQUVWLG9CQUFBLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUM7QUFFeEQsb0JBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVix3QkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2Qiw0QkFBQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2pFLElBQUksWUFBWSxJQUFJLFFBQVEsRUFBRTtBQUM3QixnQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsb0NBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0NBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLDZCQUFBO0FBQ0QseUJBQUE7QUFDRCxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsT0FBTyxRQUFRLENBQUM7U0FDaEIsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUdLLElBQUEsd0JBQXdCLENBQUMsUUFBZ0IsRUFBQTs7WUFDOUMsSUFBSSxTQUFTLEdBQTBDLEVBQUUsQ0FBQztZQUMxRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBRTlDLFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2QixvQkFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDeEIsU0FBUzs7QUFHVixvQkFBQSxJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDO0FBRTFELG9CQUFBLElBQUksTUFBTSxFQUFFO0FBQ1gsd0JBQUEsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDekIsNEJBQUEsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNsRSxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7QUFDN0IsZ0NBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLG9DQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dDQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyw2QkFBQTtBQUNELHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLE9BQU8sU0FBUyxDQUFDO1NBQ2pCLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFJSyxjQUFjLEdBQUE7O1lBQ25CLElBQUksUUFBUSxHQUF5QyxFQUFFLENBQUM7WUFDeEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUU5QyxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1YsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdkIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2hDLFNBQVM7O0FBR1Ysb0JBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQztBQUV4RCxvQkFBQSxJQUFJLEtBQUssRUFBRTtBQUNWLHdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFOzRCQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztnQ0FDNUIsU0FBUztBQUVWLDRCQUFBLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0NBQzdDLFNBQVM7QUFFViw0QkFBQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDM0QsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNWLGdDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixvQ0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQ0FDMUIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsNkJBQUE7QUFDRCx5QkFBQTtBQUNELHFCQUFBO0FBQ0QsaUJBQUE7QUFDRCxhQUFBO0FBRUQsWUFBQSxPQUFPLFFBQVEsQ0FBQztTQUNoQixDQUFBLENBQUE7QUFBQSxLQUFBO0lBRUssZUFBZSxHQUFBOztZQUNwQixJQUFJLFNBQVMsR0FBMEMsRUFBRSxDQUFDO1lBQzFELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFFOUMsWUFBQSxJQUFJLEtBQUssRUFBRTtBQUNWLGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3ZCLG9CQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxTQUFTOztBQUdWLG9CQUFBLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUM7QUFFMUQsb0JBQUEsSUFBSSxNQUFNLEVBQUU7QUFDWCx3QkFBQSxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtBQUN6Qiw0QkFBQSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dDQUMvQyxTQUFTO0FBRVYsNEJBQUEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQzVELElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVixnQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDeEIsb0NBQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0NBQzNCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLDZCQUFBO0FBQ0QseUJBQUE7QUFDRCxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsT0FBTyxTQUFTLENBQUM7U0FDakIsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUdLLGVBQWUsR0FBQTs7WUFDcEIsSUFBSSxRQUFRLEdBQXlDLEVBQUUsQ0FBQztZQUN4RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBRTlDLFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2QixvQkFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDaEMsU0FBUzs7QUFHVixvQkFBQSxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDO0FBRXhELG9CQUFBLElBQUksS0FBSyxFQUFFO0FBQ1Ysd0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO2dDQUM1QixTQUFTO0FBRVYsNEJBQUEsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQ0FDN0MsU0FBUztBQUVWLDRCQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsNEJBQUEsSUFBSSxJQUFJLEVBQUU7QUFDVCxnQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsb0NBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0NBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLDZCQUFBO0FBQ0QseUJBQUE7QUFDRCxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsT0FBTyxRQUFRLENBQUM7U0FDaEIsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLHFCQUFxQixHQUFBOztZQUMxQixJQUFJLFFBQVEsR0FBeUMsRUFBRSxDQUFDO1lBQ3hELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFFOUMsWUFBQSxJQUFJLEtBQUssRUFBRTtBQUNWLGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3ZCLG9CQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxTQUFTOztBQUdWLG9CQUFBLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDeEQsb0JBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVix3QkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2Qiw0QkFBQSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dDQUM3QyxTQUFTOzRCQUVWLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ25ELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVTtnQ0FDakIsU0FBUztBQUVWLDRCQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNELDRCQUFBLElBQUksSUFBSSxFQUFFO0FBQ1QsZ0NBQUEsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQ0FDL0QsU0FBUztBQUNULGlDQUFBO0FBRUQsZ0NBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQzNDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFckQsZ0NBQUEsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztvQ0FDMUIsU0FBUztnQ0FFVixJQUFJLEtBQUssR0FBRyxtREFBbUQsQ0FBQztnQ0FDaEUsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dDQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0NBRXJDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRTtBQUNsQyxvQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsd0NBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0NBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGlDQUFBO0FBQ0QsNkJBQUE7QUFDRCx5QkFBQTtBQUNELHFCQUFBO0FBQ0QsaUJBQUE7QUFDRCxhQUFBO0FBRUQsWUFBQSxPQUFPLFFBQVEsQ0FBQztTQUNoQixDQUFBLENBQUE7QUFBQSxLQUFBO0lBRUssZ0JBQWdCLEdBQUE7O1lBQ3JCLElBQUksU0FBUyxHQUEwQyxFQUFFLENBQUM7WUFDMUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUU5QyxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1YsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdkIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2hDLFNBQVM7O0FBR1Ysb0JBQUEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUUxRCxvQkFBQSxJQUFJLE1BQU0sRUFBRTtBQUNYLHdCQUFBLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3pCLDRCQUFBLElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0NBQy9DLFNBQVM7QUFFViw0QkFBQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELDRCQUFBLElBQUksSUFBSSxFQUFFO0FBQ1QsZ0NBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLG9DQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dDQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyw2QkFBQTtBQUNELHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLE9BQU8sU0FBUyxDQUFDO1NBQ2pCLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFFSyxlQUFlLEdBQUE7O1lBQ3BCLElBQUksUUFBUSxHQUF5QyxFQUFFLENBQUM7WUFDeEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUU5QyxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1YsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdkIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2hDLFNBQVM7O0FBR1Ysb0JBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQztBQUV4RCxvQkFBQSxJQUFJLEtBQUssRUFBRTtBQUNWLHdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFOzRCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0NBQzlDLFNBQVM7QUFFViw0QkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsZ0NBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRS9CLHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLE9BQU8sUUFBUSxDQUFDO1NBQ2hCLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFFSyxnQkFBZ0IsR0FBQTs7WUFDckIsSUFBSSxTQUFTLEdBQTBDLEVBQUUsQ0FBQztZQUMxRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBRTlDLFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2QixvQkFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDaEMsU0FBUzs7QUFHVixvQkFBQSxJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDO0FBRTFELG9CQUFBLElBQUksTUFBTSxFQUFFO0FBQ1gsd0JBQUEsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7NEJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQ0FDaEQsU0FBUztBQUVWLDRCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN4QixnQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDM0IsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMseUJBQUE7QUFDRCxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsT0FBTyxTQUFTLENBQUM7U0FDakIsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUdLLHdCQUF3QixDQUFDLFdBQW1CLEVBQUUsV0FBbUIsRUFBRSxjQUFjLEdBQUcsS0FBSyxFQUFFLDZCQUE2QixHQUFHLEtBQUssRUFBQTs7QUFDckksWUFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3JFLE9BQU87WUFFUixJQUFJLEtBQUssR0FBRyw2QkFBNkIsR0FBRyxNQUFNLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxSixZQUFBLElBQUksS0FBSyxHQUFxQixDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUUvRSxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1YsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7b0JBQ3ZCLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDakUsaUJBQUE7QUFDRCxhQUFBO1NBQ0QsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUdLLHVCQUF1QixDQUFDLFFBQWdCLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxjQUFjLEdBQUcsS0FBSyxFQUFBOztBQUN2RyxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE9BQU87QUFFUixZQUFBLElBQUksT0FBTyxHQUFxQixDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN6RSxPQUFPLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDOUUsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUdLLElBQUEsd0JBQXdCLENBQUMsUUFBZ0IsRUFBRSxZQUE4QixFQUFFLGNBQWMsR0FBRyxLQUFLLEVBQUE7O0FBQ3RHLFlBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsT0FBTztZQUVSLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyw2Q0FBNkMsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDaEcsT0FBTztBQUNQLGFBQUE7QUFFRCxZQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztZQUVsQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzVDLGdCQUFBLEtBQUssSUFBSSxFQUFFLElBQUksUUFBUSxFQUFFO29CQUN4QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTlDLG9CQUFBLElBQUksRUFBRSxDQUFDLFVBQVU7QUFDaEIsd0JBQUEsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBRWhCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkQsb0JBQUEsS0FBSyxJQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUU7QUFDckMsd0JBQUEsSUFBSSxRQUFRLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUNwQyw0QkFBQSxJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEUsNEJBQUEsVUFBVSxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVwRCw0QkFBQSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDakMsZ0NBQUEsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsNkJBQUE7NEJBRUQsSUFBSSxjQUFjLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFFakQsZ0NBQUEsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7b0NBQ2xGLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7b0NBQ25DLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLG9DQUFBLEdBQUcsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0MsaUNBQUE7QUFDRCw2QkFBQTs0QkFFRCxJQUFJLEVBQUUsQ0FBQyxVQUFVO2dDQUNoQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFckYsZ0NBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUM7NEJBRW5FLEtBQUssR0FBRyxJQUFJLENBQUM7QUFFYiw0QkFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRywrREFBK0Q7a0NBQ2hHLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUE7QUFDckQseUJBQUE7QUFDRCxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsSUFBSSxLQUFLO0FBQ1IsZ0JBQUEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pDLENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFHSyxJQUFBLDhCQUE4QixDQUFDLFdBQW1CLEVBQUUsV0FBbUIsRUFBRSx1QkFBZ0MsRUFBQTs7QUFDOUcsWUFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3JFLE9BQU87WUFFUixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsK0NBQStDLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQ3JHLE9BQU87QUFDUCxhQUFBO0FBRUQsWUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM1QyxnQkFBQSxLQUFLLElBQUksRUFBRSxJQUFJLFFBQVEsRUFBRTtvQkFDeEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUU5QyxvQkFBQSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO3dCQUN2QixTQUFTO0FBRVYsb0JBQUEsSUFBSSxFQUFFLENBQUMsVUFBVTtBQUNoQix3QkFBQSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQzs7QUFJaEIsb0JBQUEsSUFBSSx1QkFBdUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzt3QkFDOUUsU0FBUztvQkFFVixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDVixJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7d0JBQzdDLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDViw0QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsdUNBQXVDLEdBQUcsSUFBSSxDQUFDLENBQUM7NEJBQ3BHLFNBQVM7QUFDVCx5QkFBQTtBQUNELHFCQUFBO0FBR0Qsb0JBQUEsSUFBSSxVQUFVLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELG9CQUFBLFVBQVUsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFcEQsb0JBQUEsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLHdCQUFBLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLHFCQUFBO29CQUVELElBQUksRUFBRSxDQUFDLFVBQVU7d0JBQ2hCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVyRix3QkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFbkUsS0FBSyxHQUFHLElBQUksQ0FBQztBQUViLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLDhEQUE4RDswQkFDL0YsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxVQUFVLENBQUMsQ0FBQztBQUN0RCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLElBQUksS0FBSztBQUNSLGdCQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN6QyxDQUFBLENBQUE7QUFBQSxLQUFBO0FBR0ssSUFBQSxnQ0FBZ0MsQ0FBQyxRQUFnQixFQUFBOztZQUN0RCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUVqRCxZQUFBLElBQUksUUFBUSxFQUFFO0FBQ2IsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDMUIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2hDLFNBQVM7QUFFVixvQkFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3pCLG9CQUFBLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRO3dCQUN4QixTQUFTOztBQUdWLG9CQUFBLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUN6RCxvQkFBQSxJQUFJLE1BQU0sRUFBRTtBQUNYLHdCQUFBLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3pCLDRCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDOUQsSUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO0FBQ3pCLGdDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM1QixvQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RCLDZCQUFBO0FBQ0QseUJBQUE7QUFDRCxxQkFBQTs7QUFHRCxvQkFBQSxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDdkQsb0JBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVix3QkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN2Qiw0QkFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzdELElBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUN6QixnQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDNUIsb0NBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0Qiw2QkFBQTtBQUNELHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLE9BQU8sS0FBSyxDQUFDO1NBQ2IsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUdLLElBQUEsMEJBQTBCLENBQUMsUUFBZ0IsRUFBQTs7WUFDaEQsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO1lBQ3pCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFFakQsWUFBQSxJQUFJLFFBQVEsRUFBRTtBQUNiLGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFO0FBQzFCLG9CQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxTQUFTO0FBRVYsb0JBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDekIsSUFBSSxRQUFRLElBQUksUUFBUTt3QkFDdkIsU0FBUztvQkFFVixJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxvQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCx3QkFBQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDOUQsSUFBSSxZQUFZLElBQUksUUFBUSxFQUFFO0FBQzdCLDRCQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM1QixnQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RCLHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLE9BQU8sS0FBSyxDQUFDO1NBQ2IsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUVELElBQUEseUJBQXlCLENBQUMsSUFBWSxFQUFBO0FBQ3JDLFFBQUEsSUFBSSxHQUFHLEdBQW9CO0FBQzFCLFlBQUEsVUFBVSxFQUFFLEtBQUs7QUFDakIsWUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUEsT0FBTyxFQUFFLEVBQUU7U0FDWCxDQUFBO0FBRUQsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDdEIsWUFBQSxPQUFPLEdBQUcsQ0FBQztRQUdaLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU1QyxRQUFBLElBQUksaUJBQWlCLEdBQUcsT0FBTyxJQUFJLEVBQUUsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hFLFFBQUEsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEYsSUFBSSxpQkFBaUIsSUFBSSxnQkFBZ0IsRUFBRTtBQUMxQyxZQUFBLEdBQUcsR0FBRztBQUNMLGdCQUFBLFVBQVUsRUFBRSxJQUFJO0FBQ2hCLGdCQUFBLElBQUksRUFBRSxjQUFjO0FBQ3BCLGdCQUFBLE9BQU8sRUFBRSxPQUFPO2FBQ2hCLENBQUE7QUFDRCxTQUFBO0FBRUQsUUFBQSxPQUFPLEdBQUcsQ0FBQztLQUNYO0lBR0QsOEJBQThCLENBQUMsUUFBZ0IsRUFBRSxXQUFtQixFQUFBO1FBQ25FLE9BQU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0c7QUFHSyxJQUFBLGdCQUFnQixDQUFDLFFBQWdCLEVBQUE7O1lBQ3RDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvQ0FBb0MsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDdkYsT0FBTztBQUNQLGFBQUE7QUFFRCxZQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNDLElBQUksS0FBSyxHQUFnQixFQUFFLENBQUM7WUFFNUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM1QyxnQkFBQSxLQUFLLElBQUksRUFBRSxJQUFJLFFBQVEsRUFBRTtvQkFDeEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakQsb0JBQUEsSUFBSSxHQUFHLEdBQWM7QUFDcEIsd0JBQUEsSUFBSSxFQUFFLElBQUk7QUFDVix3QkFBQSxXQUFXLEVBQUUsR0FBRztBQUNoQix3QkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNaLHdCQUFBLFFBQVEsRUFBRTtBQUNULDRCQUFBLEtBQUssRUFBRTtBQUNOLGdDQUFBLEdBQUcsRUFBRSxDQUFDO0FBQ04sZ0NBQUEsSUFBSSxFQUFFLENBQUM7QUFDUCxnQ0FBQSxNQUFNLEVBQUUsQ0FBQztBQUNULDZCQUFBO0FBQ0QsNEJBQUEsR0FBRyxFQUFFO0FBQ0osZ0NBQUEsR0FBRyxFQUFFLENBQUM7QUFDTixnQ0FBQSxJQUFJLEVBQUUsQ0FBQztBQUNQLGdDQUFBLE1BQU0sRUFBRSxDQUFDO0FBQ1QsNkJBQUE7QUFDRCx5QkFBQTtxQkFDRCxDQUFDO0FBRUYsb0JBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixpQkFBQTtBQUNELGFBQUE7QUFDRCxZQUFBLE9BQU8sS0FBSyxDQUFDO1NBQ2IsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUtLLElBQUEsbUNBQW1DLENBQUMsUUFBZ0IsRUFBQTs7QUFDekQsWUFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2dCQUMvQixPQUFPO1lBRVIsSUFBSSxhQUFhLEdBQXNCLEVBQUUsQ0FBQztBQUUxQyxZQUFBLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUV6RCxZQUFBLElBQUksTUFBTSxFQUFFO0FBQ1gsZ0JBQUEsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7b0JBQ3pCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3ZFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9ELElBQUksZUFBZSxJQUFJLFdBQVcsRUFBRTtBQUNuQyx3QkFBQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEQsd0JBQUEsSUFBSSxJQUFJOzRCQUNQLFNBQVM7QUFFVix3QkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6RSx3QkFBQSxJQUFJLElBQUksRUFBRTtBQUNULDRCQUFBLElBQUksVUFBVSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDNUQsVUFBVSxHQUFHLGVBQWUsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRS9HLDRCQUFBLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNqQyxnQ0FBQSxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyw2QkFBQTtBQUVELDRCQUFBLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZELHlCQUFBO0FBQU0sNkJBQUE7QUFDTiw0QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsd0NBQXdDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hHLHlCQUFBO0FBQ0QscUJBQUE7QUFBTSx5QkFBQTtBQUNOLHdCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxnRUFBZ0UsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEkscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7WUFFRCxNQUFNLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0QsWUFBQSxPQUFPLGFBQWEsQ0FBQztTQUNyQixDQUFBLENBQUE7QUFBQSxLQUFBO0FBR0ssSUFBQSxrQ0FBa0MsQ0FBQyxRQUFnQixFQUFBOztBQUN4RCxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE9BQU87WUFFUixJQUFJLFlBQVksR0FBcUIsRUFBRSxDQUFDO0FBRXhDLFlBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDO0FBRXZELFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxjQUFjLElBQUksVUFBVSxFQUFFO3dCQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzs0QkFDNUIsU0FBUztBQUVWLHdCQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCx3QkFBQSxJQUFJLElBQUk7NEJBQ1AsU0FBUzs7QUFHVix3QkFBQSxJQUFJLGNBQWMsRUFBRTs0QkFDbkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN0RCw0QkFBQSxJQUFJLFFBQVE7QUFDWCxnQ0FBQSxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyx5QkFBQTtBQUVELHdCQUFBLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hFLHdCQUFBLElBQUksSUFBSSxFQUFFO0FBQ1QsNEJBQUEsSUFBSSxVQUFVLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1RCxVQUFVLEdBQUcsY0FBYyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFOUcsNEJBQUEsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLGdDQUFBLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLDZCQUFBO0FBRUQsNEJBQUEsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDckQseUJBQUE7QUFBTSw2QkFBQTtBQUNOLDRCQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsR0FBRyx1Q0FBdUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEcseUJBQUE7QUFDRCxxQkFBQTtBQUFNLHlCQUFBO0FBQ04sd0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxHQUFHLCtEQUErRCxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsSSxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtZQUVELE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRCxZQUFBLE9BQU8sWUFBWSxDQUFDO1NBQ3BCLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFHSyx3QkFBd0IsQ0FBQyxRQUFnQixFQUFFLGFBQWdDLEVBQUE7O0FBQ2hGLFlBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsT0FBTztZQUVSLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRywrQ0FBK0MsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDbEcsT0FBTztBQUNQLGFBQUE7QUFFRCxZQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUVsQixZQUFBLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzlDLGdCQUFBLEtBQUssSUFBSSxLQUFLLElBQUksYUFBYSxFQUFFO29CQUNoQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPO3dCQUNsQyxTQUFTO29CQUVWLElBQUksSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDekQsd0JBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4RyxxQkFBQTt5QkFBTSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzVELHdCQUFBLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3RFLHFCQUFBO0FBQU0seUJBQUE7QUFDTix3QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsZ0VBQWdFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEksU0FBUztBQUNULHFCQUFBO0FBRUQsb0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcseURBQXlEO0FBQzFGLDBCQUFBLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBRXRFLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDYixpQkFBQTtBQUNELGFBQUE7QUFFRCxZQUFBLElBQUksS0FBSztBQUNSLGdCQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QyxDQUFBLENBQUE7QUFBQSxLQUFBO0lBR0ssdUJBQXVCLENBQUMsUUFBZ0IsRUFBRSxZQUE4QixFQUFBOztBQUM3RSxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE9BQU87WUFFUixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsOENBQThDLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ2pHLE9BQU87QUFDUCxhQUFBO0FBRUQsWUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7QUFFbEIsWUFBQSxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM1QyxnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRTtvQkFDOUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTzt3QkFDaEMsU0FBUztvQkFFVixJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3ZELHdCQUFBLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDcEcscUJBQUE7eUJBQU0sSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxRCx3QkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNuRSxxQkFBQTtBQUFNLHlCQUFBO0FBQ04sd0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxHQUFHLCtEQUErRCxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3RJLFNBQVM7QUFDVCxxQkFBQTtBQUVELG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLCtEQUErRDtBQUNoRywwQkFBQSxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUVwRSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2IsaUJBQUE7QUFDRCxhQUFBO0FBRUQsWUFBQSxJQUFJLEtBQUs7QUFDUixnQkFBQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDN0MsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUdLLElBQUEsd0NBQXdDLENBQUMsUUFBZ0IsRUFBQTs7QUFDOUQsWUFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2dCQUMvQixPQUFPO0FBRVIsWUFBQSxJQUFJLEdBQUcsR0FBOEI7QUFDcEMsZ0JBQUEsS0FBSyxFQUFFLEVBQUU7QUFDVCxnQkFBQSxNQUFNLEVBQUUsRUFBRTthQUNWLENBQUE7WUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0RBQWtELEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3JHLE9BQU87QUFDUCxhQUFBO1lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELFlBQUEsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN4QixZQUFBLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDMUIsWUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbEIsSUFBSSxNQUFNLEVBQUU7QUFDWCxnQkFBQSxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtvQkFDekIsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUVqRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUNwRCxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFBO3dCQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdDLHdCQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLHNFQUFzRTtBQUN2Ryw4QkFBQSxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQTtBQUVoRSx3QkFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7d0JBRWpELEtBQUssR0FBRyxJQUFJLENBQUM7QUFDYixxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUMvQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRW5ELHdCQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUUsd0JBQUEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM3RCw0QkFBQSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUUzQix3QkFBQSxJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUE7d0JBQ2hFLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFNUMsd0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsOERBQThEO0FBQy9GLDhCQUFBLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFBO0FBRS9ELHdCQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTt3QkFFL0MsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNiLHFCQUFBO0FBQ0QsaUJBQUE7QUFDRCxhQUFBO0FBRUQsWUFBQSxJQUFJLEtBQUs7QUFDUixnQkFBQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFN0MsWUFBQSxPQUFPLEdBQUcsQ0FBQztTQUNYLENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFDRDs7TUN4OEJZLFlBQVksQ0FBQTtJQUN4QixXQUNTLENBQUEsR0FBUSxFQUNSLEVBQWdCLEVBQ2hCLGdCQUFBLEdBQTJCLEVBQUUsRUFDN0IsYUFBMEIsR0FBQSxFQUFFLEVBQzVCLGdCQUFBLEdBQTZCLEVBQUUsRUFBQTtRQUovQixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBSztRQUNSLElBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUFjO1FBQ2hCLElBQWdCLENBQUEsZ0JBQUEsR0FBaEIsZ0JBQWdCLENBQWE7UUFDN0IsSUFBYSxDQUFBLGFBQUEsR0FBYixhQUFhLENBQWU7UUFDNUIsSUFBZ0IsQ0FBQSxnQkFBQSxHQUFoQixnQkFBZ0IsQ0FBZTtLQUNuQztBQUVMLElBQUEsYUFBYSxDQUFDLElBQVksRUFBQTtBQUN6QixRQUFBLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDeEIsWUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUxQixRQUFBLEtBQUssSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QyxZQUFBLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM1QixnQkFBQSxPQUFPLElBQUksQ0FBQztBQUNaLGFBQUE7QUFDRCxTQUFBO0FBRUQsUUFBQSxLQUFLLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1QyxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVyQyxZQUFBLElBQUcsVUFBVSxFQUFFO0FBQ2QsZ0JBQUEsT0FBTyxJQUFJLENBQUM7QUFDWixhQUFBO0FBQ0QsU0FBQTtLQUNEO0lBRUssaUNBQWlDLENBQUMsSUFBWSxFQUFFLGNBQXNCLEVBQUE7O0FBQzNFLFlBQUEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbkUsWUFBQSxPQUFPLE1BQU0sSUFBSSxDQUFDLGlDQUFpQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2pFLENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFFSyxJQUFBLGlDQUFpQyxDQUFDLFFBQWdCLEVBQUE7O0FBQ3ZELFlBQUEsSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLElBQUk7O2dCQUVILE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ2xELGFBQUE7QUFBQyxZQUFBLE9BQUEsRUFBQSxFQUFNLEdBQUc7U0FDWCxDQUFBLENBQUE7QUFBQSxLQUFBO0FBRUQsSUFBQSxvQkFBb0IsQ0FBQyxZQUFvQixFQUFBO1FBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDckMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hDLFlBQUEsSUFBSSxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDbkQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0MsWUFBQSxJQUFJLENBQUMsU0FBUztBQUNiLGdCQUFBLE9BQU8sT0FBTyxDQUFDO0FBQ2hCLFNBQUE7QUFDRCxRQUFBLE9BQU8sRUFBRSxDQUFDO0tBQ1Y7QUFFSyxJQUFBLHlCQUF5QixDQUFDLFdBQW1CLEVBQUUsV0FBbUIsRUFDdkUsZ0JBQXlCLEVBQUUsb0JBQTRCLEVBQUE7O0FBRXZELFlBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO2dCQUNyRSxPQUFPOzs7QUFLUixZQUFBLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUU1RCxZQUFBLElBQUksQ0FBQyxNQUFNO2dCQUNWLE9BQU87QUFFUixZQUFBLElBQUksTUFBTSxHQUEwQjtBQUNuQyxnQkFBQSxnQkFBZ0IsRUFBRSxFQUFFO0FBQ3BCLGdCQUFBLFlBQVksRUFBRSxFQUFFO2FBQ2hCLENBQUM7QUFFRixZQUFBLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3pCLGdCQUFBLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDdEIsZ0JBQUEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFaEUsZ0JBQUEsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RSxvQkFBQSxTQUFTO0FBRVYsZ0JBQUEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNWLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVix3QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsd0NBQXdDLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQ3JHLFNBQVM7QUFDVCxxQkFBQTtBQUNELGlCQUFBOzs7Z0JBSUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3ZHLFNBQVM7QUFFVixnQkFBQSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUUxRixnQkFBQSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSTtvQkFDM0IsU0FBUztBQUVWLGdCQUFBLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDckcsZ0JBQUEsTUFBTSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDL0UsZ0JBQUEsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFbkUsYUFBQTtBQUVELFlBQUEsT0FBTyxNQUFNLENBQUM7U0FDZCxDQUFBLENBQUE7QUFBQSxLQUFBO0FBRUQsSUFBQSxvQkFBb0IsQ0FBQyxpQkFBeUIsRUFBRSxRQUFnQixFQUFFLGFBQXFCLEVBQUE7QUFDdEYsUUFBQSxJQUFJLHFCQUFxQixHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbkcsUUFBQSxJQUFJLE9BQU8sR0FBRyxDQUFDLHFCQUFxQixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2hJLFFBQUEsT0FBTyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNGLFFBQUEsT0FBTyxPQUFPLENBQUM7S0FDZjtBQUdLLElBQUEsK0JBQStCLENBQUMsUUFBZ0IsRUFBRSxhQUFxQixFQUM1RSxnQkFBeUIsRUFBQTs7O0FBRXpCLFlBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsT0FBTztBQUVSLFlBQUEsSUFBSSxNQUFNLEdBQTBCO0FBQ25DLGdCQUFBLGdCQUFnQixFQUFFLEVBQUU7QUFDcEIsZ0JBQUEsWUFBWSxFQUFFLEVBQUU7YUFDaEIsQ0FBQztZQUVGLE1BQU0sS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVqRCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQSxFQUFBLEdBQUEsS0FBSyxDQUFDLE1BQU0sTUFBSSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUEsRUFBQSxHQUFBLEtBQUssQ0FBQyxLQUFLLE1BQUksSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVuRSxZQUFBLEtBQUssSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzdCLGdCQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztBQUVoRSxnQkFBQSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7O29CQUV6QixTQUFTO0FBQ1QsaUJBQUE7QUFFRCxnQkFBQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5RCxnQkFBQSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O29CQUU1RSxTQUFTO0FBQ1QsaUJBQUE7QUFFRCxnQkFBQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQ2hELElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVixvQkFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ2pFLG9CQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQSxFQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRyxFQUFBLFFBQVEsWUFBWSxJQUFJLENBQUEsd0JBQUEsRUFBMkIsSUFBSSxDQUFBLENBQUUsQ0FBQyxDQUFDO29CQUNwRyxTQUFTO0FBQ1QsaUJBQUE7Z0JBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFFL0MsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFOztvQkFFdEQsU0FBUztBQUNULGlCQUFBO0FBRUQsZ0JBQUEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTVFLGdCQUFBLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O29CQUV6QixTQUFTO0FBQ1QsaUJBQUE7QUFFRCxnQkFBQSxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFakYsZ0JBQUEsTUFBTSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDL0UsZ0JBQUEsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkUsYUFBQTtBQUVELFlBQUEsT0FBTyxNQUFNLENBQUM7O0FBQ2QsS0FBQTtBQUdLLElBQUEsY0FBYyxDQUFDLElBQVcsRUFBRSxXQUFtQixFQUFFLGVBQXlCLEVBQUUsZ0JBQXlCLEVBQUE7O0FBQzFHLFlBQUEsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV2QixZQUFBLElBQUksTUFBTSxHQUEwQjtBQUNuQyxnQkFBQSxnQkFBZ0IsRUFBRSxFQUFFO0FBQ3BCLGdCQUFBLFlBQVksRUFBRSxFQUFFO2FBQ2hCLENBQUM7QUFFRixZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7QUFDM0IsZ0JBQUEsT0FBTyxNQUFNLENBQUM7WUFHZixJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7Z0JBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLHdEQUF3RCxDQUFDLENBQUE7QUFDOUYsZ0JBQUEsT0FBTyxNQUFNLENBQUM7QUFDZCxhQUFBO0FBRUQsWUFBQSxNQUFNLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxRCxJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkUsWUFBQSxJQUFJLGVBQWUsRUFBRTtBQUNwQixnQkFBQSxLQUFLLElBQUksUUFBUSxJQUFJLGVBQWUsRUFBRTtBQUNyQyxvQkFBQSxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLGlCQUFBO0FBQ0QsYUFBQTtBQUVELFlBQUEsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCxnQkFBQSxPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZGLGFBQUE7OztBQUlELFlBQUEsSUFBSSxXQUFXLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxTQUFTLEVBQUU7O0FBRWYsb0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsNkJBQTZCLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQTtBQUNqRyxvQkFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtBQUNyRSxvQkFBQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDL0MsaUJBQUE7QUFBTSxxQkFBQTtBQUNOLG9CQUFBLElBQUksZ0JBQWdCLEVBQUU7O3dCQUVyQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQTtBQUNoRSx3QkFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtBQUNyRSx3QkFBQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMscUJBQUE7QUFBTSx5QkFBQTs7d0JBRU4sSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzVELHdCQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLDJDQUEyQyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUFDLENBQUE7QUFDbkgsd0JBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDekUsd0JBQUEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ25ELHdCQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQTtBQUM1RSxxQkFBQTtBQUNELGlCQUFBO0FBQ0QsYUFBQTs7O0FBR0ksaUJBQUE7Z0JBQ0osSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxTQUFTLEVBQUU7O0FBRWYsb0JBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsNkJBQTZCLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQTtBQUNqRyxvQkFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtBQUNyRSxvQkFBQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDN0MsaUJBQUE7QUFBTSxxQkFBQTtBQUNOLG9CQUFBLElBQUksZ0JBQWdCLEVBQUUsQ0FFckI7QUFBTSx5QkFBQTs7d0JBRU4sSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzVELHdCQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLDJDQUEyQyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUFDLENBQUE7QUFDbkgsd0JBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO0FBQzlFLHdCQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNqRCx3QkFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDNUUscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7QUFDRCxZQUFBLE9BQU8sTUFBTSxDQUFDO1NBQ2QsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUtLLElBQUEsa0JBQWtCLENBQUMsT0FBZSxFQUFBOztBQUN2QyxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLE9BQU87QUFFUixZQUFBLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDM0IsZ0JBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFHaEMsWUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEQsWUFBQSxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEMsZ0JBQUEsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckMsYUFBQTtBQUVELFlBQUEsSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRCxZQUFBLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsNEJBQTRCLEdBQUcsT0FBTyxDQUFDLENBQUE7QUFDM0UsZ0JBQUEsSUFBSSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQy9DLG9CQUFBLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEQsYUFBQTtTQUNELENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFFSyxJQUFBLG9DQUFvQyxDQUFDLFFBQWdCLEVBQUE7O0FBQzFELFlBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsT0FBTzs7QUFHUixZQUFBLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUN6RCxZQUFBLElBQUksTUFBTSxFQUFFO0FBQ1gsZ0JBQUEsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDekIsb0JBQUEsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUV0QixvQkFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDMUQsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNFLG9CQUFBLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDNUIsd0JBQUEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RCx3QkFBQSxJQUFJLElBQUksRUFBRTs0QkFDVCxJQUFJO0FBQ0gsZ0NBQUEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLDZCQUFBO0FBQUMsNEJBQUEsT0FBQSxFQUFBLEVBQU0sR0FBRztBQUNYLHlCQUFBO0FBQ0QscUJBQUE7QUFDRCxpQkFBQTtBQUNELGFBQUE7U0FFRCxDQUFBLENBQUE7QUFBQSxLQUFBO0FBQ0Q7O0FDMVNvQixNQUFBLDZCQUE4QixTQUFRQyxlQUFNLENBQUE7QUFBakUsSUFBQSxXQUFBLEdBQUE7O1FBS0UsSUFBb0IsQ0FBQSxvQkFBQSxHQUFxQixFQUFFLENBQUM7UUFDNUMsSUFBc0IsQ0FBQSxzQkFBQSxHQUFxQixFQUFFLENBQUM7UUFFOUMsSUFBZ0IsQ0FBQSxnQkFBQSxHQUFHLEtBQUssQ0FBQztLQWtuQjFCO0lBaG5CTyxNQUFNLEdBQUE7O0FBQ1YsWUFBQSxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUUxQixZQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxhQUFhLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3BFLENBQUM7QUFFRixZQUFBLElBQUksQ0FBQyxhQUFhLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxLQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUN0QyxDQUNGLENBQUM7WUFFRixJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2QsZ0JBQUEsRUFBRSxFQUFFLHlCQUF5QjtBQUM3QixnQkFBQSxJQUFJLEVBQUUseUJBQXlCO0FBQy9CLGdCQUFBLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtBQUM3QyxhQUFBLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxVQUFVLENBQUM7QUFDZCxnQkFBQSxFQUFFLEVBQUUsa0NBQWtDO0FBQ3RDLGdCQUFBLElBQUksRUFBRSxxQ0FBcUM7QUFDM0MsZ0JBQUEsY0FBYyxFQUFFLENBQUMsTUFBYyxFQUFFLElBQWtCLEtBQ2pELElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBQ25ELGFBQUEsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNkLGdCQUFBLEVBQUUsRUFBRSxzQkFBc0I7QUFDMUIsZ0JBQUEsSUFBSSxFQUFFLHNCQUFzQjtBQUM1QixnQkFBQSxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDMUMsYUFBQSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2QsZ0JBQUEsRUFBRSxFQUFFLG9DQUFvQztBQUN4QyxnQkFBQSxJQUFJLEVBQUUsb0NBQW9DO0FBQzFDLGdCQUFBLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyw2QkFBNkIsRUFBRTtBQUNyRCxhQUFBLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxVQUFVLENBQUM7QUFDZCxnQkFBQSxFQUFFLEVBQUUscUNBQXFDO0FBQ3pDLGdCQUFBLElBQUksRUFBRSxxQ0FBcUM7QUFDM0MsZ0JBQUEsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDLCtCQUErQixFQUFFO0FBQ3ZELGFBQUEsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNkLGdCQUFBLEVBQUUsRUFBRSwyQ0FBMkM7QUFDL0MsZ0JBQUEsSUFBSSxFQUFFLDRDQUE0QztBQUNsRCxnQkFBQSxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUMsb0NBQW9DLEVBQUU7QUFDNUQsYUFBQSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2QsZ0JBQUEsRUFBRSxFQUFFLGtCQUFrQjtBQUN0QixnQkFBQSxJQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLGdCQUFBLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDdkMsYUFBQSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2QsZ0JBQUEsRUFBRSxFQUFFLG1CQUFtQjtBQUN2QixnQkFBQSxJQUFJLEVBQUUseUJBQXlCO0FBQy9CLGdCQUFBLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN4QyxhQUFBLENBQUMsQ0FBQzs7WUFHSCxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FDakUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNaLENBQUM7WUFFRixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksWUFBWSxDQUN4QixJQUFJLENBQUMsR0FBRyxFQUNSLG9DQUFvQyxFQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDL0IsQ0FBQztBQUVGLFlBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FDeEIsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsRUFBRSxFQUNQLG9DQUFvQyxFQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDL0IsQ0FBQztTQUNILENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFFRCxJQUFBLGFBQWEsQ0FBQyxJQUFZLEVBQUE7QUFDeEIsUUFBQSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQUUsWUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRCxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFO0FBQzlDLFlBQUEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzNCLGdCQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsYUFBQTtBQUNGLFNBQUE7UUFFRCxLQUFLLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7QUFDcEQsWUFBQSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEIsZ0JBQUEsT0FBTyxJQUFJLENBQUM7QUFDYixhQUFBO0FBQ0YsU0FBQTtLQUNGO0FBRUssSUFBQSxpQkFBaUIsQ0FBQyxJQUFtQixFQUFBOztBQUN6QyxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLE9BQU87QUFFMUMsWUFBQSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTtBQUNwQixnQkFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7b0JBQzNDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0QsaUJBQUE7O0FBR0QsZ0JBQUEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFO29CQUNwQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO3dCQUNoRSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RSx3QkFBQSxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7NEJBQy9CLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyx5QkFBQTtBQUNGLHFCQUFBO0FBQ0YsaUJBQUE7QUFDRixhQUFBO1NBQ0YsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLGlCQUFpQixDQUFDLElBQW1CLEVBQUUsT0FBZSxFQUFBOztBQUMxRCxZQUFBLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV6RSxZQUFBLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsWUFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFLO2dCQUM3QixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQzthQUNuQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1YsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLDBCQUEwQixHQUFBOztZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLElBQUksQ0FBQzs7Z0JBRXJFLE9BQU87WUFFVCxJQUFJLElBQUksQ0FBQyxnQkFBZ0I7O2dCQUV2QixPQUFPO0FBRVQsWUFBQSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBRTdCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7QUFDeEQsWUFBQSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDOztZQUcvQixPQUFPLENBQUMsR0FBRyxDQUNULDREQUE0RDtnQkFDMUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU07Z0JBQ2xDLGdCQUFnQjtBQUNoQixnQkFBQSxLQUFLLENBQ1IsQ0FBQztZQUVGLElBQUk7QUFDRixnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtBQUM1QyxvQkFBQSxJQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNoQyx3QkFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBRWhDLE9BQU87O0FBSVQsb0JBQUEsSUFBSSxNQUE2QixDQUFDO0FBRWxDLG9CQUFBLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRXBFLElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTs7QUFHcEIsd0JBQUEsSUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7NEJBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUMxRDtBQUNBLDRCQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtBQUN6QyxnQ0FBQSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUM5QyxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FDbkMsQ0FBQztBQUVGLGdDQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksTUFBTSxFQUFFO0FBQ3ZDLG9DQUFBLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUMzQyxNQUFNLENBQUMsZ0JBQWdCLENBQ3hCLENBQUM7QUFDRixvQ0FBQSxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLHdDQUFBLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDcEMsSUFBSSxDQUFDLE9BQU8sRUFDWixZQUFZLENBQ2IsQ0FBQztBQUNILHFDQUFBO0FBQ0YsaUNBQUE7QUFDRiw2QkFBQTtBQUVELDRCQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0NBQzdCLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyw4QkFBOEIsQ0FDMUMsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQ3RDLENBQUM7QUFDSCw2QkFBQTs7QUFHRCw0QkFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7Z0NBQ3BDLElBQ0UsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQy9EO29DQUNBLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQzNCLENBQUM7QUFDRixvQ0FBQSxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0NBQy9CLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxxQ0FBQTtBQUNGLGlDQUFBO0FBQ0YsNkJBQUE7QUFDRix5QkFBQTtBQUNGLHFCQUFBO29CQUVELElBQUksVUFBVSxHQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQztBQUMzRCxvQkFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO3dCQUM3QixNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQ3BDLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE9BQU8sRUFDWixVQUFVLEVBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FDNUMsQ0FBQztBQUNILHFCQUFBO0FBRUQsb0JBQUEsSUFDRSxNQUFNO0FBQ04sd0JBQUEsTUFBTSxDQUFDLGdCQUFnQjtBQUN2Qix3QkFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbEM7d0JBQ0EsSUFBSUMsZUFBTSxDQUNSLFFBQVE7NEJBQ04sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU07NEJBQzlCLGFBQWE7QUFDYiw2QkFBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQ2xELENBQUM7QUFDSCxxQkFBQTtBQUNGLGlCQUFBO0FBQ0YsYUFBQTtBQUFDLFlBQUEsT0FBTyxDQUFDLEVBQUU7QUFDVixnQkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNELGFBQUE7O0FBR0QsWUFBQSxPQUFPLENBQUMsR0FBRyxDQUNULGdFQUFnRSxDQUNqRSxDQUFDO0FBRUYsWUFBQSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBRTlCLElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JFLGdCQUFBLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsTUFBSztvQkFDN0IsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7aUJBQ25DLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDVCxhQUFBO1NBQ0YsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLDZCQUE2QixDQUFDLE1BQWMsRUFBRSxJQUFrQixFQUFBOztBQUNwRSxZQUFBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDckIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNqQyxnQkFBQSxJQUFJQSxlQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDbkMsT0FBTztBQUNSLGFBQUE7WUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsK0JBQStCLENBQ3hELElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsQ0FDM0MsQ0FBQztBQUVGLFlBQUEsSUFDRSxNQUFNO0FBQ04sZ0JBQUEsTUFBTSxDQUFDLGdCQUFnQjtBQUN2QixnQkFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbEM7QUFDQSxnQkFBQSxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQ3BDLElBQUksQ0FBQyxJQUFJLEVBQ1QsTUFBTSxDQUFDLGdCQUFnQixDQUN4QixDQUFDO0FBQ0gsYUFBQTtBQUVELFlBQUEsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxJQUFJLENBQUM7QUFDckMsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O2dCQUVuRCxJQUFJQSxlQUFNLENBQ1IsUUFBUTtvQkFDTixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTTtvQkFDOUIsYUFBYTtBQUNiLHFCQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FDbEQsQ0FBQztTQUNMLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFFSyxxQkFBcUIsR0FBQTs7WUFDekIsSUFBSSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7WUFFNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUU5QyxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1QsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdEIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQUUsU0FBUztvQkFFNUMsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLCtCQUErQixDQUN4RCxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQzNDLENBQUM7QUFFRixvQkFBQSxJQUNFLE1BQU07QUFDTix3QkFBQSxNQUFNLENBQUMsZ0JBQWdCO0FBQ3ZCLHdCQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNsQztBQUNBLHdCQUFBLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDcEMsSUFBSSxDQUFDLElBQUksRUFDVCxNQUFNLENBQUMsZ0JBQWdCLENBQ3hCLENBQUM7QUFDRix3QkFBQSxxQkFBcUIsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO0FBQ3hELHdCQUFBLG1CQUFtQixFQUFFLENBQUM7QUFDdkIscUJBQUE7QUFDRixpQkFBQTtBQUNGLGFBQUE7WUFFRCxJQUFJLHFCQUFxQixJQUFJLENBQUM7QUFDNUIsZ0JBQUEsSUFBSUEsZUFBTSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O2dCQUVuRCxJQUFJQSxlQUFNLENBQ1IsUUFBUTtvQkFDTixxQkFBcUI7b0JBQ3JCLGFBQWE7cUJBQ1oscUJBQXFCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ3RDLFFBQVE7b0JBQ1IsbUJBQW1CO29CQUNuQixPQUFPO0FBQ1AscUJBQUMsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FDdkMsQ0FBQztTQUNMLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFFSywrQkFBK0IsR0FBQTs7WUFDbkMsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7WUFFNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUU5QyxZQUFBLElBQUksS0FBSyxFQUFFO0FBQ1QsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdEIsb0JBQUEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQUUsU0FBUztBQUU1QyxvQkFBQSxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsbUNBQW1DLENBQzVELElBQUksQ0FBQyxJQUFJLENBQ1YsQ0FBQztBQUVGLG9CQUFBLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQy9CLHdCQUFBLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbkMsd0JBQUEsbUJBQW1CLEVBQUUsQ0FBQztBQUN2QixxQkFBQTtBQUNGLGlCQUFBO0FBQ0YsYUFBQTtZQUVELElBQUksaUJBQWlCLElBQUksQ0FBQztBQUN4QixnQkFBQSxJQUFJQSxlQUFNLENBQUMsMkNBQTJDLENBQUMsQ0FBQzs7Z0JBRXhELElBQUlBLGVBQU0sQ0FDUixZQUFZO29CQUNWLGlCQUFpQjtvQkFDakIsUUFBUTtxQkFDUCxpQkFBaUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDbEMsUUFBUTtvQkFDUixtQkFBbUI7b0JBQ25CLE9BQU87QUFDUCxxQkFBQyxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUN2QyxDQUFDO1NBQ0wsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLDZCQUE2QixHQUFBOztZQUNqQyxJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztZQUU1QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBRTlDLFlBQUEsSUFBSSxLQUFLLEVBQUU7QUFDVCxnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN0QixvQkFBQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFBRSxTQUFTO0FBRTVDLG9CQUFBLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FDM0QsSUFBSSxDQUFDLElBQUksQ0FDVixDQUFDO0FBRUYsb0JBQUEsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDL0Isd0JBQUEsaUJBQWlCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuQyx3QkFBQSxtQkFBbUIsRUFBRSxDQUFDO0FBQ3ZCLHFCQUFBO0FBQ0YsaUJBQUE7QUFDRixhQUFBO1lBRUQsSUFBSSxpQkFBaUIsSUFBSSxDQUFDO0FBQ3hCLGdCQUFBLElBQUlBLGVBQU0sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDOztnQkFFdkQsSUFBSUEsZUFBTSxDQUNSLFlBQVk7b0JBQ1YsaUJBQWlCO29CQUNqQixPQUFPO3FCQUNOLGlCQUFpQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNsQyxRQUFRO29CQUNSLG1CQUFtQjtvQkFDbkIsT0FBTztBQUNQLHFCQUFDLG1CQUFtQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQ3ZDLENBQUM7U0FDTCxDQUFBLENBQUE7QUFBQSxLQUFBO0lBRUssb0NBQW9DLEdBQUE7O1lBQ3hDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO1lBRTVCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFFOUMsWUFBQSxJQUFJLEtBQUssRUFBRTtBQUNULGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3RCLG9CQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUFFLFNBQVM7QUFFNUMsb0JBQUEsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLHdDQUF3QyxDQUNqRSxJQUFJLENBQUMsSUFBSSxDQUNWLENBQUM7QUFFRixvQkFBQSxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDbkUsd0JBQUEsaUJBQWlCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDekMsd0JBQUEsaUJBQWlCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDMUMsd0JBQUEsbUJBQW1CLEVBQUUsQ0FBQztBQUN2QixxQkFBQTtBQUNGLGlCQUFBO0FBQ0YsYUFBQTtZQUVELElBQUksaUJBQWlCLElBQUksQ0FBQztBQUN4QixnQkFBQSxJQUFJQSxlQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQzs7Z0JBRTNELElBQUlBLGVBQU0sQ0FDUixXQUFXO29CQUNULGlCQUFpQjtvQkFDakIsV0FBVztxQkFDVixpQkFBaUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDbEMsUUFBUTtvQkFDUixtQkFBbUI7b0JBQ25CLE9BQU87QUFDUCxxQkFBQyxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUN2QyxDQUFDO1NBQ0wsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVELGtCQUFrQixHQUFBO0FBQ2hCLFFBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQztJQUVJLGdCQUFnQixHQUFBOztZQUNyQixJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDOUMsSUFBSSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDNUQsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2hELElBQUksU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNoRCxJQUFJLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUVoRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFFZCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNqRCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNuRCxJQUFJLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQy9ELElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ25ELElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBRXJELElBQUksYUFBYSxHQUFHLENBQUMsRUFBRTtBQUNyQixnQkFBQSxJQUFJLElBQUksZUFBZSxHQUFHLGFBQWEsR0FBRyxXQUFXLENBQUM7QUFDdEQsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7b0JBQ3pCLElBQUk7QUFDRix3QkFBQSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN0RSxvQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSTs0QkFDRixVQUFVO2lDQUNULElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0NBQzlCLE1BQU07QUFDTixnQ0FBQSxJQUFJLENBQUMsSUFBSTtBQUNULGdDQUFBLEtBQUssQ0FBQztBQUNULHFCQUFBO29CQUNELElBQUksSUFBSSxNQUFNLENBQUM7QUFDaEIsaUJBQUE7QUFDRixhQUFBO0FBQU0saUJBQUE7Z0JBQ0wsSUFBSSxJQUFJLGdCQUFnQixDQUFDO2dCQUN6QixJQUFJLElBQUksdUJBQXVCLENBQUM7QUFDakMsYUFBQTtZQUVELElBQUksb0JBQW9CLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixJQUFJO0FBQ0Ysb0JBQUEsZ0NBQWdDLEdBQUcsb0JBQW9CLEdBQUcsV0FBVyxDQUFDO0FBQ3hFLGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksZUFBZSxFQUFFO29CQUNoQyxJQUFJO0FBQ0Ysd0JBQUEsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEUsb0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdEMsd0JBQUEsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3JELElBQUk7NEJBQ0YsVUFBVTtpQ0FDVCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dDQUM5QixNQUFNO0FBQ04sZ0NBQUEsRUFBRSxDQUFDLElBQUk7Z0NBQ1AsR0FBRztnQ0FDSCxPQUFPO0FBQ1AsZ0NBQUEsS0FBSyxDQUFDO0FBQ1QscUJBQUE7b0JBQ0QsSUFBSSxJQUFJLE1BQU0sQ0FBQztBQUNoQixpQkFBQTtBQUNGLGFBQUE7QUFBTSxpQkFBQTtnQkFDTCxJQUFJLElBQUksZ0NBQWdDLENBQUM7Z0JBQ3pDLElBQUksSUFBSSx1QkFBdUIsQ0FBQztBQUNqQyxhQUFBO1lBRUQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLGdCQUFBLElBQUksSUFBSSxvQkFBb0IsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBQzVELGdCQUFBLEtBQUssSUFBSSxJQUFJLElBQUksU0FBUyxFQUFFO29CQUMxQixJQUFJO0FBQ0Ysd0JBQUEsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEUsb0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ2hDLElBQUk7NEJBQ0YsVUFBVTtpQ0FDVCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dDQUM5QixNQUFNO0FBQ04sZ0NBQUEsSUFBSSxDQUFDLElBQUk7QUFDVCxnQ0FBQSxLQUFLLENBQUM7QUFDVCxxQkFBQTtvQkFDRCxJQUFJLElBQUksTUFBTSxDQUFDO0FBQ2hCLGlCQUFBO0FBQ0YsYUFBQTtBQUFNLGlCQUFBO2dCQUNMLElBQUksSUFBSSxxQkFBcUIsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLHVCQUF1QixDQUFDO0FBQ2pDLGFBQUE7WUFFRCxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7QUFDdEIsZ0JBQUEsSUFBSSxJQUFJLGdCQUFnQixHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFDeEQsZ0JBQUEsS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEVBQUU7b0JBQzFCLElBQUk7QUFDRix3QkFBQSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN0RSxvQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDaEMsSUFBSTs0QkFDRixVQUFVO2lDQUNULElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0NBQzlCLE1BQU07QUFDTixnQ0FBQSxJQUFJLENBQUMsUUFBUTtBQUNiLGdDQUFBLEtBQUssQ0FBQztBQUNULHFCQUFBO29CQUNELElBQUksSUFBSSxNQUFNLENBQUM7QUFDaEIsaUJBQUE7QUFDRixhQUFBO0FBQU0saUJBQUE7Z0JBQ0wsSUFBSSxJQUFJLGlCQUFpQixDQUFDO2dCQUMxQixJQUFJLElBQUksdUJBQXVCLENBQUM7QUFDakMsYUFBQTtZQUVELElBQUksZUFBZSxHQUFHLENBQUMsRUFBRTtBQUN2QixnQkFBQSxJQUFJLElBQUkscUJBQXFCLEdBQUcsZUFBZSxHQUFHLFdBQVcsQ0FBQztBQUM5RCxnQkFBQSxLQUFLLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtvQkFDM0IsSUFBSTtBQUNGLHdCQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RFLG9CQUFBLEtBQUssSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNqQyxJQUFJOzRCQUNGLFVBQVU7aUNBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztnQ0FDOUIsTUFBTTtBQUNOLGdDQUFBLElBQUksQ0FBQyxRQUFRO0FBQ2IsZ0NBQUEsS0FBSyxDQUFDO0FBQ1QscUJBQUE7b0JBQ0QsSUFBSSxJQUFJLE1BQU0sQ0FBQztBQUNoQixpQkFBQTtBQUNGLGFBQUE7QUFBTSxpQkFBQTtnQkFDTCxJQUFJLElBQUksc0JBQXNCLENBQUM7Z0JBQy9CLElBQUksSUFBSSx1QkFBdUIsQ0FBQztBQUNqQyxhQUFBO0FBRUQsWUFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO0FBQ25ELFlBQUEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVuRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEtBQUk7QUFDM0MsZ0JBQUEsSUFDRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRTtvQkFDM0IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsRUFDMUM7b0JBQ0EsVUFBVSxHQUFHLElBQUksQ0FBQztBQUNuQixpQkFBQTtBQUNILGFBQUMsQ0FBQyxDQUFDO0FBRUgsWUFBQSxJQUFJLENBQUMsVUFBVTtBQUFFLGdCQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3hFLENBQUEsQ0FBQTtBQUFBLEtBQUE7SUFFSyxlQUFlLEdBQUE7O0FBQ25CLFlBQUEsTUFBTSxJQUFJLENBQUMsb0NBQW9DLEVBQUUsQ0FBQztBQUNsRCxZQUFBLE1BQU0sSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUM7QUFDN0MsWUFBQSxNQUFNLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDOztBQUUzQyxZQUFBLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDbkMsWUFBQSxNQUFNLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2hDLFlBQUEsSUFBSUEsZUFBTSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDckQsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLFlBQVksR0FBQTs7QUFDaEIsWUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDNUUsQ0FBQSxDQUFBO0FBQUEsS0FBQTtJQUVLLFlBQVksR0FBQTs7WUFDaEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVuQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksWUFBWSxDQUN4QixJQUFJLENBQUMsR0FBRyxFQUNSLG9DQUFvQyxFQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDL0IsQ0FBQztBQUVGLFlBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FDeEIsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsRUFBRSxFQUNQLG9DQUFvQyxFQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDL0IsQ0FBQztTQUNILENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFDRjs7OzsifQ==
