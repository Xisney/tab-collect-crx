import type { ComponentType } from "react"
import Collect from "./pages/collect"
import Home from "./pages/home"

const routerConfig = {
  home: Home,
  collect: Collect,
  edit: Collect
}

export function getPage(page: Pages, props: any) {
  return withPropsIn(routerConfig[page], props)
}

function withPropsIn(Component: ComponentType, props: any) {
  return <Component {...props} />
}

export type Pages = keyof typeof routerConfig

export interface Page {
  page: Pages
  props?: any
}

export const isHome = (page: Pages) => page === "home"
