import { ipcRenderer, contextBridge } from 'electron'

// --------- 将部分 API 暴露给渲染进程 ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  // 监听主进程发送的消息
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  // 移除监听器
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  // 向主进程发送消息
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    console.log(args)
    return ipcRenderer.send(channel, ...omit)
  },
  // 向主进程发送消息并等待响应
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  // 在这里暴露其他需要的 API
})

