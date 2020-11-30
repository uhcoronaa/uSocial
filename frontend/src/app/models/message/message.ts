export class Message {
    id_message: number;
    id_friendship: number;
    date_sent: string;
    message: string;
    bot: number;
    id_user_sent: number;
    id_user_received?: number;

    constructor(
        _id_message: number,
        _id_friendship: number,
        _date_sent: string,
        _message: string,
        _bot: number,
        _id_user_sent: number,
    ) {
        this.id_message = _id_message;
        this.id_friendship = _id_friendship;
        this.date_sent = _date_sent;
        this.message = _message;
        this.bot = _bot;
        this.id_user_sent = _id_user_sent;
    }
}
