import {RoomType} from "./enum.ts";

export interface newRoom {
    roomName: string
    type: RoomType
    lock: boolean,
    password: string | null
}