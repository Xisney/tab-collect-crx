import { DeleteOutlined } from "@ant-design/icons"
import { Avatar, List, Button, message, Tooltip } from "antd"
import { FC, useEffect, useState } from "react"
import {
  getCurrentWinTabs,
  getData,
  getTargetPropOfTabs,
  removeData,
  saveData,
  SaveItem
} from "~popup/util"
import type { CommonPageProps } from "../common"

import style from "./index.module.less"

export interface CollectProps extends CommonPageProps {
  collectKey?: string
}

const Collect: FC<CollectProps> = ({ setPage, collectKey }) => {
  const [tabs, setTabs] = useState<Array<chrome.tabs.Tab | SaveItem>>([])

  useEffect(() => {
    if (collectKey) {
      getData(collectKey).then((data) => {
        setTabs(data[collectKey])
      })
    } else {
      getCurrentWinTabs().then((tabs) => {
        setTabs(tabs.filter(({ url }) => url))
      })
    }
  }, [])

  const handleDelete = (index: number) => {
    setTabs(tabs.filter((_, i) => i !== index))
  }

  const handleAdd = async () => {
    const tabs = await getCurrentWinTabs()
    setTabs((pre) => {
      const filteredTabs = getTargetPropOfTabs(tabs).filter(
        (t) => t.url && pre.findIndex((v) => v.url === t.url) === -1
      )
      return pre.concat(filteredTabs)
    })
  }

  const handleConfirm = async () => {
    try {
      if (collectKey) {
        if (tabs.length === 0) {
          await removeData(collectKey)
        } else {
          await saveData({ [collectKey]: tabs as SaveItem[] })
        }
      } else {
        if (tabs.length !== 0) {
          await saveData({
            [Date.now() + ""]: getTargetPropOfTabs(tabs as chrome.tabs.Tab[])
          })
        }
      }
      message.success("保存成功")
      setPage({ page: "home" })
    } catch {
      message.error("保存失败")
    }
  }

  return (
    <>
      <div className="app-main">
        <List
          dataSource={tabs}
          className={style["collect-list"]}
          renderItem={({ title, favIconUrl, url }, index) => {
            return (
              <List.Item
                actions={[
                  <DeleteOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleDelete(index)
                    }}
                  />
                ]}
                className="list-item">
                <Avatar
                  src={favIconUrl}
                  style={{ flexShrink: 0, marginRight: 10 }}
                />
                <Tooltip title={title}>
                  <a href={url} target="__blank" className="collect-title">
                    {title}
                  </a>
                </Tooltip>
              </List.Item>
            )
          }}
        />
      </div>
      <div className="app-footer">
        {collectKey && (
          <Button style={{ marginRight: 16 }} onClick={handleAdd}>
            补充
          </Button>
        )}
        <Button type="primary" onClick={handleConfirm}>
          确认
        </Button>
      </div>
    </>
  )
}

export default Collect
