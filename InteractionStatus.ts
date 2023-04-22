import {User} from "discord.js";

export default class InteractionStatus {
    public type: InteractionType;
    public user: User;
    public status: boolean;
    public error: Error;

    constructor(type: InteractionType, user: User, status: boolean, error: Error) {
        this.type = type;
        this.user = user;
        this.status = status;
        this.error = error;
    }
}

export enum InteractionType {
    Button="Button",
    Command="Command",
    Menu="Menu",
    Modal="Modal"
}