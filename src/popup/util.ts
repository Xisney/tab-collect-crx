export const targetKeyOfTab = ["url", "favIconUrl", "title"] as const

type ArrToUnion<T, R = never> = T extends readonly [infer A, ...infer B]
  ? ArrToUnion<B, R | A>
  : R

export type SaveItem = Required<
  Pick<chrome.tabs.Tab, ArrToUnion<typeof targetKeyOfTab>>
>

type SaveData = Record<string, SaveItem[]>

export function getCurrentWinTabs() {
  return chrome.tabs.query({ currentWindow: true })
}

export function getData(key?: string | string[]): Promise<SaveData> {
  return chrome.storage.sync.get(key || null)
}

export function saveData(data: SaveData) {
  return chrome.storage.sync.set(data)
}

export function removeData(key: string | string[]) {
  return chrome.storage.sync.remove(key)
}

export function updateData(data: SaveItem[], oldKey: string, newKey: string) {
  return Promise.all([saveData({ [newKey]: data }), removeData(oldKey)])
}

export async function openLinks(key: string) {
  const links = (await getData(key))[key]
  const tabIds = []

  for (let i = 0; i < links.length; i++) {
    const { id: tabId } = await chrome.tabs.create({
      active: false,
      url: links[i].url
    })

    tabIds.push(tabId)
  }

  const groupId = await chrome.tabs.group({ tabIds })

  await chrome.tabGroups.update(groupId, {
    title: key
  })
}
