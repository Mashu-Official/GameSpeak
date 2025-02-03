import { app, BrowserWindow } from 'electron' // 导入 Electron 的核心模块
import { createRequire } from 'node:module' // 导入 Node.js 的 createRequire 方法
import { fileURLToPath } from 'node:url' // 导入 Node.js 的 fileURLToPath 方法
import path from 'node:path'
import WinState from "electron-win-state"; // 导入 Node.js 的 path 模块

// 使用 createRequire 创建一个 require 函数，用于兼容 CommonJS 模块
const require = createRequire(import.meta.url)

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 应用程序的目录结构
//
// ├─┬─┬ dist
// │ │ └── index.html (渲染进程的构建输出)
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js (主进程的构建输出)
// │ │ └── preload.mjs (预加载脚本)
// │
process.env.APP_ROOT = path.join(__dirname, '..') // 设置应用程序的根目录

// 🚧 使用 ['ENV_NAME'] 避免 Vite 的 define 插件冲突 - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'] // Vite 开发服务器的 URL
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron') // 主进程的构建输出目录
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist') // 渲染进程的构建输出目录

// 设置静态资源路径
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public') // 开发环境下使用 public 目录
    : RENDERER_DIST // 生产环境下使用渲染进程的构建输出目录

let win: BrowserWindow | null // 声明一个 BrowserWindow 实例变量

// 创建应用程序窗口的函数
function createWindow() {
  // 初始化窗口
const winState = new WinState({
  // defaultWidth:300,
  // defaultHeight:600 // mobile size
  defaultWidth:1080,
  defaultHeight:640 // desktop size
});
  win = new BrowserWindow({
    ...winState.winOptions,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'), // 设置窗口图标
    frame: false, // 无边框窗口
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // 设置预加载脚本
    },
    autoHideMenuBar: true, // 自动隐藏菜单栏
    // alwaysOnTop: true, // 窗口始终置顶
  })

  // 当窗口内容加载完成时，向渲染进程发送消息
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 如果是开发环境，加载 Vite 开发服务器的 URL
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // 如果是生产环境，加载渲染进程的构建输出文件
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// 当所有窗口关闭时退出应用程序（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 如果不是 macOS
    app.quit() // 退出应用程序
    win = null // 清空窗口实例
  }
})

// 当应用程序被激活时（例如点击 Dock 图标）
app.on('activate', () => {
  // 如果没有打开的窗口，则创建一个新窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 当应用程序准备就绪时，创建窗口
app.whenReady().then(createWindow)