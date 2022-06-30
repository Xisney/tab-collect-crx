import { LeftOutlined } from "@ant-design/icons"
import { ConfigProvider, Typography } from "antd"
import "antd/dist/antd.css"
import zhCN from "antd/lib/locale/zh_CN"
import React, { useState } from "react"

import style from "./index.module.less"
import { Page, isHome, getPage } from "./router"

import { message } from "antd"

const { Title } = Typography

message.config({
  duration: 1
})

const App = () => {
  const [{ page, props }, setPage] = useState<Page>({ page: "home" })

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style["app-container"]}>
        <Title level={5} className="app-title">
          {isHome(page) ? (
            "Tab收集"
          ) : (
            <span
              className="title-return"
              onClick={() => {
                setPage({ page: "home" })
              }}>
              <LeftOutlined />
              返回
            </span>
          )}
        </Title>
        {getPage(page, { setPage, ...props })}
      </div>
    </ConfigProvider>
  )
}

export default App
