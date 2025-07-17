import { Events } from "discord.js";

export default {
    name: Events.Error,
    once: false,
    async execute(client, err) {
        console.log(err);
    }
};