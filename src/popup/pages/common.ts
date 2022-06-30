import type { Page } from "~popup/router"

export interface CommonPageProps {
  setPage?: (page: Page) => void
}
