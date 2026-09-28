import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { RouterContext, useRouter, type RouterValue } from './router-context.ts'

type Parts = Pick<RouterValue, 'pathname' | 'search' | 'hash'>

/** URL API rather than string splitting: '#services' must resolve to pathname '/', hash '#services'. */
const parse = (href: string): Parts => {
  const { pathname, search, hash } = new URL(href, window.location.origin)
  return { pathname, search, hash }
}

const readLocation = (): Parts => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
})

const serialise = ({ pathname, search, hash }: Parts) => pathname + search + hash

export function RouterProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<Parts>(readLocation)
  const [navTick, setNavTick] = useState(0)

  useEffect(() => {
    const sync = () => setParts(readLocation())
    // popstate covers back/forward; hashchange covers fragment-only moves, which fire no popstate
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const navigate = useCallback((href: string, options?: { replace?: boolean }) => {
    const next = parse(href)
    if (serialise(next) === serialise(readLocation())) {
      // Same URL: the user still expects the page to react (e.g. the sticky pill on /booking
      // re-topping a scrolled page), so tick without pushing a duplicate history entry.
      setNavTick((n) => n + 1)
      return
    }
    if (options?.replace) window.history.replaceState({}, '', serialise(next))
    else window.history.pushState({}, '', serialise(next))
    setParts(next)
  }, [])

  const value = useMemo<RouterValue>(
    () => ({ ...parts, navigate, navTick }),
    [parts, navigate, navTick],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Real anchor + client-side navigation, so cmd-click / middle-click / "copy link" still work. */
export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()

  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    // let the browser handle modified clicks and non-primary buttons
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    // external links, new tabs and downloads are none of our business
    if (/^[a-z]+:/i.test(href) || rest.target === '_blank' || rest.download) return
    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

/**
 * Scrolls to location.hash after a route render, honouring each section's scroll-mt.
 *
 * The reset to the top runs in a layout effect and is then re-asserted for a few frames: the
 * booking route is lazy, so it mounts *after* this commit, and the resulting height change re-clamps
 * the scroll offset and drops us at the bottom of the new page.
 */
export function ScrollManager() {
  const { pathname, hash, navTick } = useRouter()

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    // `behavior: 'instant'` is ignored by browsers that predate it, and a fallback to 'auto' would
    // honour the global `scroll-behavior: smooth`. Override it inline to guarantee a real jump.
    const root = document.documentElement
    const reset = () => {
      if (window.scrollY === 0) return
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      root.style.scrollBehavior = previous
    }

    reset()
    let frames = 0
    let raf = requestAnimationFrame(function reassert() {
      if (window.scrollY === 0 || frames++ > 5) return
      reset()
      raf = requestAnimationFrame(reassert)
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash, navTick])

  return null
}
