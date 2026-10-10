/** Browser preference key. Not a secret. Never read on the server. */
export const THEME_STORAGE_KEY = "repovista-theme";

/**
 * Static initializer. Runs before paint so the saved theme does not flash.
 * The string contains no request data.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;
