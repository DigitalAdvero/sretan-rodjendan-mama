// The texts live in public/content.js — a plain script loaded before the app,
// so they can be edited (even directly on GitHub) without rebuilding the site.
// This module only hands them to the components.
const content = window.SITE_CONTENT

export const { intro, hero, letter, gallery, surprises, dova, finale, ui } = content
