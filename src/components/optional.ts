import { lazy, type ComponentType } from 'react'
// Loads a React Bits component only if src/components/<Name>.jsx exists.
// Missing file => returns null and the site shows a plain fallback, so the build never breaks.
const files = import.meta.glob('./*.jsx')
export function optional(name: string) {
  const load = files[`./${name}.jsx`] as (() => Promise<{ default: ComponentType<any> }>) | undefined
  return load ? lazy(load) : null
}
