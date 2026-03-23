// Lightweight global toast caller.
// Layout.jsx sets _addToast when it mounts.
// All pages import { toast } from here — no circular dependency.

let _addToast = null

export function _registerToast(fn) {
  _addToast = fn
}

export const toast = {
  success: (msg) => _addToast?.(msg, 'success'),
  error:   (msg) => _addToast?.(msg, 'error'),
  info:    (msg) => _addToast?.(msg, 'info'),
  warning: (msg) => _addToast?.(msg, 'warning'),
}