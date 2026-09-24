export function fmtINR(n) {
  n = Math.round(n);
  return '₹' + n.toLocaleString('en-IN');
}

export function pct(n, digits = 1) {
  return n.toFixed(digits) + '%';
}
