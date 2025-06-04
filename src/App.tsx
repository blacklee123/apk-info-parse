import { Buffer } from 'buffer/'
import type { DescriptionsProps, UploadFile, UploadProps } from 'antd'

import { InboxOutlined } from '@ant-design/icons'
import { Descriptions, message, Space, Typography, Upload } from 'antd'
import AppInfoParser from 'app-info-parser'
import { useState } from 'react'

 ;(window as any).global = window
// eslint-disable-next-line node/prefer-global/buffer
globalThis.Buffer = globalThis.Buffer || Buffer

function App() {
  const [items, setItems] = useState<DescriptionsProps['items']>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const props: UploadProps = {
    accept: '.apk,.ipa',
    name: 'file',
    multiple: false,
    onRemove: () => {
      setFileList([])
    },
    beforeUpload: async (file) => {
      const parser = new AppInfoParser(file)
      try {
        const appInfo = await parser.parse()
        console.log(appInfo)
        setFileList([{
          uid: '-1',
          name: file.name,
          status: 'done',
        }])
        if (file.name.endsWith('.apk')) {
          setItems([
            {
              label: 'label',
              children: appInfo.application.label,
            },
            {
              label: 'icon',
              children: <img src={appInfo.icon} alt="icon" style={{ width: 50, height: 50 }} />,
            },
            {
              label: 'package',
              children: <Typography.Text copyable>{appInfo.package}</Typography.Text>,
            },
            {
              label: 'versionCode',
              children: <Typography.Text copyable>{appInfo.versionCode}</Typography.Text>,
            },
            {
              label: 'versionName',
              children: <Typography.Text copyable>{appInfo.versionName}</Typography.Text>,
            },
            {
              label: 'more',
              children: <Typography.Text type="secondary">更多信息打开控制台查看</Typography.Text>,
            },
          ])
        }
        else {
          setItems([
            {
              label: 'CFBundleDisplayName',
              children: appInfo.CFBundleDisplayName,
            },
            {
              label: 'icon',
              children: <img src={appInfo.icon} alt="icon" style={{ width: 50, height: 50 }} />,
            },
            {
              label: 'CFBundleIdentifier',
              children: <Typography.Text copyable>{appInfo.CFBundleIdentifier}</Typography.Text>,
            },
            {
              label: 'CFBundleVersion',
              children: <Typography.Text copyable>{appInfo.CFBundleVersion}</Typography.Text>,
            },
            {
              label: 'CFBundleShortVersionString',
              children: <Typography.Text copyable>{appInfo.CFBundleShortVersionString}</Typography.Text>,
            },
            {
              label: 'more',
              children: <Typography.Text type="secondary">更多信息打开控制台查看</Typography.Text>,
            },
          ])
        }
      }
      catch (error) {
        console.error(error)
        message.error('解析失败')
      }
      return false
    },
  }

  return (
    <Space direction="vertical" size="large" className="w-full p-2">
      <Upload.Dragger {...props} fileList={fileList}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽apk、ipa文件到此处解析</p>
      </Upload.Dragger>
      { fileList.length > 0
      && (
        <Descriptions className="mt-8" items={items} column={1} />
      )}

    </Space>
  )
}

export default App
