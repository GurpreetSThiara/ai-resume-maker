"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModernSidebarResumePDF = generateModernSidebarResumePDF;
var pdf_lib_1 = require("pdf-lib");
var utils_1 = require("@/lib/utils");
var sectionOrdering_1 = require("@/utils/sectionOrdering");
var skills_1 = require("@/utils/skills");
function generateModernSidebarResumePDF(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var pdfDoc, pages, regularFont, boldFont, margin, pageWidth, pageHeight, sidebarWidth, sidebarBgColor, mainContentWidth, mainContentX, textColor, sidebarTextColor, headingColor, accentColor, dividerColor, dividerThickness, drawSidebarBackground, sidebarPageIndex, sidebarY, mainPageIndex, mainY, firstPage, sanitizeForFont, wrapText, getTextWithShrink, checkSidebarSpace, checkMainSpace, addLink, drawSidebarItem, nameLines, _i, nameLines_1, line, renderSectionPdf, allSections, leftSections, rightSections, _c, leftSections_1, section, lines, page, _d, lines_1, line, _e, rightSections_1, section, pdfBytes;
        var resumeData = _b.resumeData, _f = _b.filename, filename = _f === void 0 ? "resume.pdf" : _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                case 1:
                    pdfDoc = _g.sent();
                    pages = [];
                    return [4 /*yield*/, pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica)];
                case 2:
                    regularFont = _g.sent();
                    return [4 /*yield*/, pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold)
                        // Layout constants
                    ];
                case 3:
                    boldFont = _g.sent();
                    margin = 30;
                    pageWidth = 595.276;
                    pageHeight = 841.89;
                    sidebarWidth = 180;
                    sidebarBgColor = (0, pdf_lib_1.rgb)(0.96, 0.96, 0.96);
                    mainContentWidth = pageWidth - sidebarWidth - 2 * margin;
                    mainContentX = sidebarWidth + margin;
                    textColor = (0, pdf_lib_1.rgb)(0.2, 0.2, 0.2);
                    sidebarTextColor = (0, pdf_lib_1.rgb)(0.3, 0.3, 0.3);
                    headingColor = (0, pdf_lib_1.rgb)(0.1, 0.1, 0.3);
                    accentColor = (0, pdf_lib_1.rgb)(0.2, 0.4, 0.8);
                    dividerColor = (0, pdf_lib_1.rgb)(0.85, 0.85, 0.85);
                    dividerThickness = 0.5;
                    drawSidebarBackground = function (page) {
                        page.drawRectangle({
                            x: 0,
                            y: 0,
                            width: sidebarWidth,
                            height: pageHeight,
                            color: sidebarBgColor,
                        });
                    };
                    sidebarPageIndex = 0;
                    sidebarY = pageHeight - margin;
                    mainPageIndex = 0;
                    mainY = pageHeight - margin;
                    firstPage = pdfDoc.addPage([pageWidth, pageHeight]);
                    drawSidebarBackground(firstPage);
                    pages.push(firstPage);
                    sanitizeForFont = function (text, font) {
                        if (font === void 0) { font = regularFont; }
                        return (0, utils_1.sanitizeTextForPdfWithFont)(text || "", font);
                    };
                    wrapText = function (text, maxWidth, font, size) {
                        if (font === void 0) { font = regularFont; }
                        if (size === void 0) { size = 10; }
                        return (0, utils_1.wrapText)(text, maxWidth, font, size);
                    };
                    getTextWithShrink = function (text, maxWidth, font, initialSize, minSize) {
                        if (font === void 0) { font = regularFont; }
                        if (initialSize === void 0) { initialSize = 9; }
                        if (minSize === void 0) { minSize = 6; }
                        var size = initialSize;
                        var safeText = sanitizeForFont(text, font);
                        while (size > minSize && font.widthOfTextAtSize(safeText, size) > maxWidth) {
                            size -= 0.5;
                        }
                        // If still too big at minSize, fallback to wrap? 
                        // For links, better to force split if impossible to fit, but try hard to fit.
                        // If it fits, return it.
                        if (font.widthOfTextAtSize(safeText, size) <= maxWidth) {
                            return { text: safeText, size: size };
                        }
                        // If it doesn't fit even at minSize, let's just wrap it naturally using the wrapper but at minSize
                        return { text: safeText, size: minSize, wrap: true };
                    };
                    checkSidebarSpace = function (space) {
                        if (sidebarY - space < margin) {
                            sidebarPageIndex++;
                            if (sidebarPageIndex >= pages.length) {
                                var newPage = pdfDoc.addPage([pageWidth, pageHeight]);
                                drawSidebarBackground(newPage);
                                pages.push(newPage);
                            }
                            sidebarY = pageHeight - margin;
                        }
                    };
                    checkMainSpace = function (space) {
                        if (mainY - space < margin) {
                            mainPageIndex++;
                            if (mainPageIndex >= pages.length) {
                                var newPage = pdfDoc.addPage([pageWidth, pageHeight]);
                                drawSidebarBackground(newPage);
                                pages.push(newPage);
                            }
                            mainY = pageHeight - margin;
                        }
                    };
                    addLink = function (page, text, x, y, size, font, url) {
                        var width = font.widthOfTextAtSize(text, size);
                        var height = size * 1.2;
                        var bottom = y - (size * 0.2);
                        var link = pdfDoc.context.obj({
                            Type: pdf_lib_1.PDFName.of('Annot'),
                            Subtype: pdf_lib_1.PDFName.of('Link'),
                            Rect: [x, bottom, x + width, bottom + height],
                            Border: [0, 0, 0],
                            A: {
                                Type: pdf_lib_1.PDFName.of('Action'),
                                S: pdf_lib_1.PDFName.of('URI'),
                                URI: pdf_lib_1.PDFString.of(url),
                            },
                        });
                        var ref = pdfDoc.context.register(link);
                        // Robust way to add annotation across pdf-lib versions
                        var annots = page.node.lookup(pdf_lib_1.PDFName.of('Annots'));
                        if (annots) {
                            annots.push(ref);
                        }
                        else {
                            page.node.set(pdf_lib_1.PDFName.of('Annots'), pdfDoc.context.obj([ref]));
                        }
                    };
                    drawSidebarItem = function (label, value, isLink, linkPrefix) {
                        if (isLink === void 0) { isLink = false; }
                        if (linkPrefix === void 0) { linkPrefix = ""; }
                        if (!value)
                            return;
                        // Label
                        checkSidebarSpace(25); // Estimate space for label + 1 line of value
                        var page = pages[sidebarPageIndex];
                        page.drawText(label.toUpperCase(), {
                            x: margin,
                            y: sidebarY,
                            size: 8,
                            font: boldFont,
                            color: accentColor
                        });
                        sidebarY -= 12;
                        // Value - Try shrink first
                        var shrinkResult = getTextWithShrink(value, sidebarWidth - 2 * margin, regularFont, 9);
                        var fullUrl = linkPrefix + value;
                        if (shrinkResult.wrap) {
                            // It was too big even at min size, wrap it
                            var lines = wrapText(value, sidebarWidth - 2 * margin, regularFont, 9);
                            // Re-check space for wrapped lines
                            checkSidebarSpace(lines.length * 11);
                            // Page might have changed in checkSidebarSpace, get current
                            var currPage = pages[sidebarPageIndex];
                            for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                                var line = lines_2[_i];
                                currPage.drawText(line, {
                                    x: margin,
                                    y: sidebarY,
                                    size: 9,
                                    font: regularFont,
                                    color: sidebarTextColor
                                });
                                if (isLink) {
                                    addLink(currPage, line, margin, sidebarY, 9, regularFont, fullUrl);
                                }
                                sidebarY -= 11;
                            }
                        }
                        else {
                            // Fits on one line
                            var currPage = pages[sidebarPageIndex];
                            currPage.drawText(shrinkResult.text, {
                                x: margin,
                                y: sidebarY,
                                size: shrinkResult.size,
                                font: regularFont,
                                color: sidebarTextColor
                            });
                            if (isLink) {
                                addLink(currPage, shrinkResult.text, margin, sidebarY, shrinkResult.size, regularFont, fullUrl);
                            }
                            sidebarY -= 11;
                        }
                        sidebarY -= 10;
                    };
                    nameLines = wrapText(resumeData.basics.name, sidebarWidth - 2 * margin, boldFont, 24);
                    checkSidebarSpace(nameLines.length * 28 + 20);
                    for (_i = 0, nameLines_1 = nameLines; _i < nameLines_1.length; _i++) {
                        line = nameLines_1[_i];
                        pages[sidebarPageIndex].drawText(line, {
                            x: margin, y: sidebarY, size: 24, font: boldFont, color: headingColor
                        });
                        sidebarY -= 28;
                    }
                    sidebarY -= 20;
                    // Contact Logic
                    drawSidebarItem("Email", resumeData.basics.email, true, "mailto:");
                    drawSidebarItem("Phone", resumeData.basics.phone);
                    drawSidebarItem("Location", resumeData.basics.location);
                    drawSidebarItem("LinkedIn", resumeData.basics.linkedin, true, ""); // Already http likely, or we can check. Assuming raw string.
                    renderSectionPdf = function (section, isSidebar) {
                        if (section.hidden)
                            return;
                        var hasContent = false;
                        if (['experience', 'education', 'projects'].includes(section.type)) {
                            hasContent = section.items && Array.isArray(section.items) && section.items.length > 0;
                        }
                        else if (section.type === 'custom') {
                            hasContent = section.content && Array.isArray(section.content) && section.content.length > 0;
                        }
                        else if (section.type === 'languages') {
                            hasContent = section.items && Array.isArray(section.items) && section.items.length > 0;
                        }
                        else if (section.type === 'skills') {
                            var groups = (0, skills_1.getEffectiveSkillGroupsFromSection)(section);
                            hasContent = groups.some(function (g) { return g.skills.length > 0; });
                        }
                        else if (section.type === 'custom-fields') {
                            var customEntries = Object.values(resumeData.custom || {}).filter(function (item) { return !(item === null || item === void 0 ? void 0 : item.hidden); });
                            hasContent = customEntries.length > 0;
                        }
                        if (!hasContent)
                            return;
                        var currentX = isSidebar ? margin : mainContentX;
                        var currentWidth = isSidebar ? (sidebarWidth - 2 * margin) : mainContentWidth;
                        var getPage = function () { return pages[isSidebar ? sidebarPageIndex : mainPageIndex]; };
                        var y = isSidebar ? sidebarY : mainY;
                        var updateY = function (newY) {
                            if (isSidebar)
                                sidebarY = newY;
                            else
                                mainY = newY;
                            y = newY;
                        };
                        var checkSpace = function (space) {
                            if (isSidebar)
                                checkSidebarSpace(space);
                            else
                                checkMainSpace(space);
                            y = isSidebar ? sidebarY : mainY;
                        };
                        var titleSize = 12;
                        var titleColor = headingColor;
                        // Header
                        checkSpace(40);
                        getPage().drawText(section.title.toUpperCase(), {
                            x: currentX, y: y, size: titleSize, font: boldFont, color: titleColor
                        });
                        updateY(y - 15);
                        getPage().drawLine({
                            start: { x: currentX, y: y + 5 },
                            end: { x: currentX + currentWidth, y: y + 5 },
                            thickness: dividerThickness,
                            color: dividerColor
                        });
                        updateY(y - (isSidebar ? 10 : 15));
                        // Content
                        if (section.type === 'skills') {
                            var groups = (0, skills_1.getEffectiveSkillGroupsFromSection)(section);
                            for (var _i = 0, _a = groups.filter(function (g) { return g.skills.length > 0; }); _i < _a.length; _i++) {
                                var group = _a[_i];
                                checkSpace(20);
                                if (group.title !== "General") {
                                    getPage().drawText(sanitizeForFont(group.title, boldFont), {
                                        x: currentX, y: y, size: 10, font: boldFont, color: textColor
                                    });
                                    updateY(y - 12);
                                }
                                for (var _b = 0, _c = group.skills; _b < _c.length; _b++) {
                                    var skill = _c[_b];
                                    var lines = wrapText(skill, currentWidth - 10, regularFont, 9);
                                    checkSpace(lines.length * 11 + 5);
                                    getPage().drawText("•", { x: currentX, y: y, size: 10, color: accentColor });
                                    for (var _d = 0, lines_3 = lines; _d < lines_3.length; _d++) {
                                        var line = lines_3[_d];
                                        getPage().drawText(line, { x: currentX + 10, y: y, size: 9, font: regularFont, color: sidebarTextColor });
                                        updateY(y - 11);
                                    }
                                }
                                updateY(y - 8);
                            }
                        }
                        else if (section.type === 'languages') {
                            var langItems = section.items;
                            for (var _e = 0, langItems_1 = langItems; _e < langItems_1.length; _e++) {
                                var lang = langItems_1[_e];
                                var lines = wrapText(lang, currentWidth, regularFont, 9);
                                checkSpace(lines.length * 11);
                                for (var _f = 0, lines_4 = lines; _f < lines_4.length; _f++) {
                                    var line = lines_4[_f];
                                    getPage().drawText(line, { x: currentX, y: y, size: 9, font: regularFont, color: sidebarTextColor });
                                    updateY(y - 11);
                                }
                            }
                        }
                        else if (section.type === 'experience') {
                            for (var _g = 0, _h = section.items; _g < _h.length; _g++) {
                                var exp = _h[_g];
                                checkSpace(40);
                                var p = getPage();
                                var roleLines = wrapText(exp.role, currentWidth - (isSidebar ? 0 : 80), boldFont, 11);
                                for (var _j = 0, roleLines_1 = roleLines; _j < roleLines_1.length; _j++) {
                                    var line = roleLines_1[_j];
                                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor });
                                    updateY(y - 14);
                                }
                                var dateText = "".concat(exp.startDate, " - ").concat(exp.endDate);
                                if (!isSidebar) {
                                    updateY(y + 14 * roleLines.length); // Reset for date positioning if not sidebar
                                    var dateWidth = regularFont.widthOfTextAtSize(dateText, 9);
                                    p.drawText(dateText, { x: currentX + currentWidth - dateWidth, y: y, size: 9, font: regularFont, color: sidebarTextColor });
                                    updateY(y - 14 * roleLines.length);
                                }
                                else {
                                    p.drawText(dateText, { x: currentX, y: y + 2, size: 9, font: regularFont, color: sidebarTextColor });
                                    updateY(y - 12);
                                }
                                if (!isSidebar)
                                    updateY(y + 2); // alignment correction
                                var companyLines = wrapText(exp.company, currentWidth - (isSidebar ? 0 : 80), regularFont, 10);
                                for (var i = 0; i < companyLines.length; i++) {
                                    p.drawText(sanitizeForFont(companyLines[i], regularFont), { x: currentX, y: y, size: 10, font: regularFont, color: accentColor });
                                    if (i < companyLines.length - 1)
                                        updateY(y - 12);
                                }
                                if (exp.location) {
                                    var locText = sanitizeForFont(exp.location, regularFont);
                                    if (!isSidebar) {
                                        var locWidth = regularFont.widthOfTextAtSize(locText, 9);
                                        p.drawText(locText, {
                                            x: currentX + currentWidth - locWidth,
                                            y: y,
                                            size: 9,
                                            font: regularFont,
                                            color: sidebarTextColor
                                        });
                                    }
                                    else {
                                        updateY(y - 12);
                                        p.drawText(locText, { x: currentX, y: y, size: 9, font: regularFont, color: sidebarTextColor });
                                    }
                                }
                                updateY(y - 15);
                                if (exp.achievements) {
                                    for (var _k = 0, _l = exp.achievements; _k < _l.length; _k++) {
                                        var ach = _l[_k];
                                        var lines = wrapText("\u2022 ".concat(ach), currentWidth - 10, regularFont, 10);
                                        checkSpace(lines.length * 12);
                                        for (var _m = 0, lines_5 = lines; _m < lines_5.length; _m++) {
                                            var line = lines_5[_m];
                                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor });
                                            updateY(y - 12);
                                        }
                                    }
                                }
                                updateY(y - 10);
                            }
                        }
                        else if (section.type === 'education') {
                            for (var _o = 0, _p = section.items; _o < _p.length; _o++) {
                                var edu = _p[_o];
                                checkSpace(40);
                                var p = getPage();
                                var instLines = wrapText(edu.institution, currentWidth - (isSidebar ? 0 : 80), boldFont, 11);
                                for (var _q = 0, instLines_1 = instLines; _q < instLines_1.length; _q++) {
                                    var line = instLines_1[_q];
                                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor });
                                    updateY(y - 14);
                                }
                                var dateText = "".concat(edu.startDate, " - ").concat(edu.endDate);
                                if (!isSidebar) {
                                    updateY(y + 14 * instLines.length); // Reset for date positioning
                                    var dateWidth = regularFont.widthOfTextAtSize(dateText, 9);
                                    p.drawText(dateText, { x: currentX + currentWidth - dateWidth, y: y, size: 9, font: regularFont, color: sidebarTextColor });
                                    updateY(y - 14 * instLines.length);
                                }
                                else {
                                    p.drawText(dateText, { x: currentX, y: y + 2, size: 9, font: regularFont, color: sidebarTextColor });
                                    updateY(y - 12);
                                }
                                if (!isSidebar)
                                    updateY(y + 2);
                                var degreeLines = wrapText(edu.degree, currentWidth, regularFont, 10);
                                for (var _r = 0, degreeLines_1 = degreeLines; _r < degreeLines_1.length; _r++) {
                                    var line = degreeLines_1[_r];
                                    p.drawText(sanitizeForFont(line, regularFont), { x: currentX, y: y, size: 10, font: regularFont, color: accentColor });
                                    updateY(y - 12);
                                }
                                updateY(y - 3);
                                if (edu.highlights) {
                                    for (var _s = 0, _t = edu.highlights; _s < _t.length; _s++) {
                                        var high = _t[_s];
                                        var lines = wrapText("\u2022 ".concat(high), currentWidth - 10, regularFont, 10);
                                        checkSpace(lines.length * 12);
                                        for (var _u = 0, lines_6 = lines; _u < lines_6.length; _u++) {
                                            var line = lines_6[_u];
                                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor });
                                            updateY(y - 12);
                                        }
                                    }
                                }
                                updateY(y - 10);
                            }
                        }
                        else if (section.type === 'projects') {
                            for (var _v = 0, _w = section.items; _v < _w.length; _v++) {
                                var proj = _w[_v];
                                checkSpace(40);
                                var p = getPage();
                                var projLines = wrapText(proj.name, currentWidth, boldFont, 11);
                                for (var _x = 0, projLines_1 = projLines; _x < projLines_1.length; _x++) {
                                    var line = projLines_1[_x];
                                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor });
                                    updateY(y - 13);
                                }
                                if (proj.link) {
                                    var shrink = getTextWithShrink(proj.link, currentWidth, regularFont, 9);
                                    if (shrink.wrap) {
                                        var lines = wrapText(proj.link, currentWidth, regularFont, 6);
                                        for (var _y = 0, lines_7 = lines; _y < lines_7.length; _y++) {
                                            var line = lines_7[_y];
                                            p.drawText(line, { x: currentX, y: y, size: 6, font: regularFont, color: accentColor });
                                            addLink(getPage(), line, currentX, y, 6, regularFont, proj.link);
                                            updateY(y - 8);
                                        }
                                    }
                                    else {
                                        p.drawText(shrink.text, { x: currentX, y: y, size: shrink.size, font: regularFont, color: accentColor });
                                        addLink(getPage(), shrink.text, currentX, y, shrink.size, regularFont, proj.link);
                                        updateY(y - (shrink.size + 2));
                                    }
                                }
                                if (proj.repo) {
                                    var shrink = getTextWithShrink(proj.repo, currentWidth, regularFont, 9);
                                    if (shrink.wrap) {
                                        var lines = wrapText(proj.repo, currentWidth, regularFont, 6);
                                        for (var _z = 0, lines_8 = lines; _z < lines_8.length; _z++) {
                                            var line = lines_8[_z];
                                            p.drawText(line, { x: currentX, y: y, size: 6, font: regularFont, color: accentColor });
                                            addLink(getPage(), line, currentX, y, 6, regularFont, proj.repo);
                                            updateY(y - 8);
                                        }
                                    }
                                    else {
                                        p.drawText(shrink.text, { x: currentX, y: y, size: shrink.size, font: regularFont, color: accentColor });
                                        addLink(getPage(), shrink.text, currentX, y, shrink.size, regularFont, proj.repo);
                                        updateY(y - (shrink.size + 2));
                                    }
                                }
                                updateY(y - 2);
                                if (proj.description) {
                                    for (var _0 = 0, _1 = proj.description; _0 < _1.length; _0++) {
                                        var desc = _1[_0];
                                        var lines = wrapText("\u2022 ".concat(desc), currentWidth - 10, regularFont, 10);
                                        checkSpace(lines.length * 12);
                                        for (var _2 = 0, lines_9 = lines; _2 < lines_9.length; _2++) {
                                            var line = lines_9[_2];
                                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor });
                                            updateY(y - 12);
                                        }
                                    }
                                }
                                updateY(y - 10);
                            }
                        }
                        else if (section.type === 'custom') {
                            for (var _3 = 0, _4 = section.content; _3 < _4.length; _3++) {
                                var item = _4[_3];
                                var lines = wrapText("\u2022 ".concat(item), currentWidth - 10, regularFont, 10);
                                checkSpace(lines.length * 12);
                                for (var _5 = 0, lines_10 = lines; _5 < lines_10.length; _5++) {
                                    var line = lines_10[_5];
                                    getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor });
                                    updateY(y - 12);
                                }
                            }
                            updateY(y - 10);
                        }
                        else if (section.type === 'custom-fields') {
                            var customEntries = Object.values(resumeData.custom || {}).filter(function (item) { return !(item === null || item === void 0 ? void 0 : item.hidden); });
                            for (var _6 = 0, customEntries_1 = customEntries; _6 < customEntries_1.length; _6++) {
                                var item = customEntries_1[_6];
                                var titleStr = "".concat(item.title, ": ");
                                var titleWidth = boldFont.widthOfTextAtSize(titleStr, 10);
                                checkSpace(20);
                                getPage().drawText(sanitizeForFont(titleStr, boldFont), { x: currentX, y: y, size: 10, font: boldFont, color: titleColor });
                                var contentStr = item.content || "";
                                var contentLines = wrapText(contentStr, currentWidth - titleWidth - 5, regularFont, 10);
                                if (contentLines.length > 0) {
                                    getPage().drawText(sanitizeForFont(contentLines[0], regularFont), { x: currentX + titleWidth + 5, y: y, size: 10, font: regularFont, color: textColor });
                                    if (item.link) {
                                        addLink(getPage(), sanitizeForFont(contentLines[0], regularFont), currentX + titleWidth + 5, y, 10, regularFont, item.link);
                                    }
                                    updateY(y - 12);
                                    for (var i = 1; i < contentLines.length; i++) {
                                        checkSpace(12);
                                        getPage().drawText(sanitizeForFont(contentLines[i], regularFont), { x: currentX + titleWidth + 5, y: y, size: 10, font: regularFont, color: textColor });
                                        if (item.link) {
                                            addLink(getPage(), sanitizeForFont(contentLines[i], regularFont), currentX + titleWidth + 5, y, 10, regularFont, item.link);
                                        }
                                        updateY(y - 12);
                                    }
                                }
                                else {
                                    updateY(y - 12);
                                }
                            }
                            updateY(y - 10);
                        }
                    };
                    allSections = (0, sectionOrdering_1.getSectionsForRendering)(resumeData.sections, resumeData.custom);
                    leftSections = allSections.filter(function (s) {
                        return s.column === 1 || (!s.column && ['skills', 'languages'].includes(s.type));
                    });
                    rightSections = allSections.filter(function (s) {
                        return s.column === 2 || (!s.column && !['skills', 'languages'].includes(s.type));
                    });
                    // Render left sections
                    for (_c = 0, leftSections_1 = leftSections; _c < leftSections_1.length; _c++) {
                        section = leftSections_1[_c];
                        renderSectionPdf(section, true);
                    }
                    // Summary (Main content)
                    if (resumeData.basics.summary) {
                        lines = wrapText(resumeData.basics.summary, mainContentWidth, regularFont, 10);
                        checkMainSpace(lines.length * 12 + 40);
                        page = pages[mainPageIndex];
                        page.drawText("PROFESSIONAL SUMMARY", { x: mainContentX, y: mainY, size: 12, font: boldFont, color: headingColor });
                        mainY -= 15;
                        page.drawLine({
                            start: { x: mainContentX, y: mainY + 5 },
                            end: { x: mainContentWidth + mainContentX, y: mainY + 5 },
                            thickness: dividerThickness,
                            color: dividerColor
                        });
                        mainY -= 10;
                        for (_d = 0, lines_1 = lines; _d < lines_1.length; _d++) {
                            line = lines_1[_d];
                            pages[mainPageIndex].drawText(line, { x: mainContentX, y: mainY, size: 10, font: regularFont, color: textColor });
                            mainY -= 12;
                        }
                        mainY -= 20;
                    }
                    // Render right sections
                    for (_e = 0, rightSections_1 = rightSections; _e < rightSections_1.length; _e++) {
                        section = rightSections_1[_e];
                        renderSectionPdf(section, false);
                    }
                    return [4 /*yield*/, pdfDoc.save()];
                case 4:
                    pdfBytes = _g.sent();
                    return [2 /*return*/, pdfBytes];
            }
        });
    });
}
