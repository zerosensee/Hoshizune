import { ActivityType, Events } from 'discord.js';

import { Event } from '@/base';

export default new Event(Events.ClientReady, true, (botClient) => {
  botClient.logger.info(`🎉 Bot was launched as ${botClient.user.username}`);

  botClient.user.setActivity({
    type: ActivityType.Watching,
    name: 'Discord.js',
  });
});
