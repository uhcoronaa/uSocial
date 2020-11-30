import { Message } from '../message/message';

export class User {
    id_user: number;
    username: string;
    username_old: string;
    full_name: string;
    user_password: string;
    user_picture_key: string;
    user_picture_location: string;
    active: number;
    bot: number;
    messages?: Message[];
    id_friendship: number;

    constructor(
        _id_user: number,
        _username: string,
        _full_name: string,
        _user_password: string,
        _user_picture_key: string,
        _user_picture_location: string,
        _active: number,
        _bot: number,
    ) {
        this.id_user = _id_user;
        this.username = _username;
        this.username_old = _username;
        this.full_name = _full_name;
        this.user_password = _user_password;
        this.user_picture_key = _user_picture_key;
        this.user_picture_location = _user_picture_location;
        this.active = _active;
        this.bot = _bot;
        this.messages = [new Message(0,0,"","",0,0)]
        this.id_friendship = 0;
    }
}
