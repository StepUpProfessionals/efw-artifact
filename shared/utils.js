/* ================================================
   EFW Artifacts — Shared Utilities
   Step Up Professional Language Services
   ================================================ */

/**
 * Escape HTML special characters to prevent XSS.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escape a string for use inside a RegExp.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlight occurrences of an expression (or its leading words)
 * inside a plain-text string. Returns HTML-safe string with <mark> tags.
 */
function highlightExpression(sentence, exprText) {
  if (!sentence || !exprText) return escapeHtml(sentence);

  // Try to match the full expression first (case-insensitive)
  const fullPattern = new RegExp(`(${escapeRegex(exprText)})`, 'gi');
  if (fullPattern.test(sentence)) {
    return escapeHtml(sentence).replace(
      new RegExp(`(${escapeRegex(escapeHtml(exprText))})`, 'gi'),
      '<mark>$1</mark>'
    );
  }

  // Fallback: match the first 4 words (handles paraphrased versions)
  const words = exprText.trim().split(/\s+/);
  if (words.length >= 3) {
    const pivot = words.slice(0, Math.min(5, words.length)).join(' ');
    const pivotPattern = new RegExp(`(${escapeRegex(pivot)})`, 'gi');
    if (pivotPattern.test(sentence)) {
      return escapeHtml(sentence).replace(
        new RegExp(`(${escapeRegex(escapeHtml(pivot))})`, 'gi'),
        '<mark>$1</mark>'
      );
    }
  }

  return escapeHtml(sentence);
}

/**
 * Highlight multiple expressions in a sentence, in order.
 */
function highlightAll(sentence, expressions) {
  if (!expressions || expressions.length === 0) return escapeHtml(sentence);

  // Work on raw text, apply highlights, then return HTML
  let result = escapeHtml(sentence);
  for (const expr of expressions) {
    if (!expr) continue;
    const safeExpr = escapeHtml(expr.en || '');
    if (!safeExpr) continue;
    const regex = new RegExp(`(${escapeRegex(safeExpr)})`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, '<mark>$1</mark>');
      continue;
    }
    // Partial match using first 4+ words
    const words = safeExpr.trim().split(/\s+/);
    if (words.length >= 3) {
      const pivot = words.slice(0, Math.min(5, words.length)).join(' ');
      const pivotRe = new RegExp(`(${escapeRegex(pivot)})`, 'gi');
      result = result.replace(pivotRe, '<mark>$1</mark>');
    }
  }
  return result;
}

/**
 * Announce a message to screen readers via an aria-live region.
 */
function announce(msg) {
  let region = document.getElementById('sr-announcer');
  if (!region) {
    region = document.createElement('div');
    region.id = 'sr-announcer';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
  region.textContent = '';
  setTimeout(() => { region.textContent = msg; }, 50);
}
