import process from 'node:process';

import { GatewayIntentBits } from 'discord.js';
import { createLogger, env } from '@/utils';
import { BotClient } from './bot-client';

const logger = createLogger('hoshizune');

const botClient = new BotClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

(async () => {
  logger.info('🤫 Environment variables preparing');
  await env.prepare();

  if (process.argv.includes('--rest')) {
    logger.info('🌍 REST mode selected, starting');
    await botClient.startRest();
  } else {
    logger.info('🤖 Bot mode selected, starting');
    await botClient.startBot();
  }
})();
