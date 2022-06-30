import { DeleteOutlined, EditOutlined, ExpandOutlined } from "@ant-design/icons"
import { Input, InputRef, List, Button, message, Popconfirm } from "antd"
import "antd/dist/antd.css"
import React, { FC, useEffect, useRef, useState } from "react"
import {
  getData,
  removeData,
  updateData,
  openLinks as openLinksAndGroup
} from "~popup/util"
import type { CommonPageProps } from "../common"

import style from "./index.module.less"

export interface HomeProps extends CommonPageProps {}

const Home: FC<HomeProps> = ({ setPage }) => {
  const [editIndex, setEditIndex] = useState(-1)
  const inputRef = useRef<InputRef>(null)

  const [data, setData] = useState<string[]>([])

  const handleEdit = (index: number) => {
    setEditIndex(index)
  }

  const confirmEdit = async () => {
    try {
      if (inputRef.current) {
        const oldKey = data[editIndex]
        const newKey = inputRef.current.input.value.trim()
        const saveValue = (await getData(oldKey))[oldKey]

        if (!newKey) {
          throw "不能为空"
        }

        if (data.includes(newKey)) {
          throw "名称重复，更新失败"
        }

        await updateData(saveValue, oldKey, newKey)

        data[editIndex] = newKey
        message.success("更新分组名成功")
      }
    } catch (e) {
      message.error(e)
    } finally {
      setEditIndex(-1)
    }
  }

  const confirmDelete = async (index: number) => {
    try {
      await removeData(data[index])
      message.success("删除成功")
      setData(data.filter((_, i) => i !== index))
    } catch (e) {
      message.error("删除失败")
    }
  }

  const openLinks = (index: number) => {
    openLinksAndGroup(data[index]).catch(() => {
      message.error("服务异常")
    })
  }

  useEffect(() => {
    getData().then((d) => {
      setData(Object.keys(d))
    })
  }, [])

  return (
    <>
      <div className="app-main">
        <List
          className={style["listArea"]}
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <EditOutlined
                  onClick={() => {
                    handleEdit(index)
                  }}
                />,
                <Popconfirm
                  title="确认删除吗？"
                  onConfirm={() => {
                    return confirmDelete(index)
                  }}
                  placement="left">
                  <DeleteOutlined />
                </Popconfirm>,
                <ExpandOutlined
                  onClick={() => {
                    openLinks(index)
                  }}
                />
              ]}
              className="list-item">
              {editIndex === index ? (
                <Input
                  defaultValue={item}
                  onBlur={confirmEdit}
                  onPressEnter={confirmEdit}
                  ref={inputRef}
                  autoFocus
                />
              ) : (
                <div
                  className="list-title"
                  onClick={() => {
                    setPage({
                      page: "edit",
                      props: { collectKey: data[index] }
                    })
                  }}>
                  {item}
                </div>
              )}
            </List.Item>
          )}
        />
      </div>
      <div className="app-footer">
        <Button
          type="primary"
          onClick={() => {
            setPage({ page: "collect" })
          }}>
          一键收集
        </Button>
      </div>
    </>
  )
}

export default Home
