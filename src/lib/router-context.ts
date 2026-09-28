import { createContext, useContext } from 'react'

export type RouterValue = {
  pathname: string
  search: string
  hash: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  /** Bumped on every navigate() call, including same-URL ones, so views can re-run side effects. */
  navTick: number
}

export const RouterContext = createContext<RouterValue | null>(null)

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used within a RouterProvider')
  return value
}
