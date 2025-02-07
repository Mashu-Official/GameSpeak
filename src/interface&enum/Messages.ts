export interface Messages {
    id: number
    time: string
    timeStamp: number
    content: string | string[]  // 后端设计成这样
    userName: string
    userAvatar: string
}