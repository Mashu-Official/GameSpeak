import {RoomType} from "./RoomTypeEnum.ts";

export interface RoomsList {
    id: number,
    name: string,
    type: RoomType,
    curMemberNum: number,
    memberLimit: number,
}