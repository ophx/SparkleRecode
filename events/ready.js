import { Events, ActivityType } from "discord.js";
import * as logger from "../utils/logger.js";

export default {
    name: Events.ClientReady,
    once: false,
    async execute(client) {
        const update = () => {
            client.user.setActivity({
                name: `${client.guilds.cache.size} servers`,
                type: ActivityType.Watching
            });

            logger.info(`Updated activity -> Watching ${client.guilds.cache.size} servers`);
        };

        update();

        setInterval(update, 5 * 60 * 1000);

        logger.success("Sparkle is now online");
    }
};