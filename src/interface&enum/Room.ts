import {RoomType} from "./RoomTypeEnum.ts";

export interface Room {
    id: number,
    name: string,
    type: RoomType,
    curMemberNum: number,
    maximum: number,
    havePassword: boolean,
}