import {RoomType} from "./RoomTypeEnum.ts";

export interface newRoom {
    roomName: string
    type: RoomType
    lock: boolean,
    password: string | null
}