import process from 'node:process';

import { GatewayIntentBits } from 'discord.js';
import { Client as NekosBest } from 'nekos-best.js';

import { Database } from '@/services';
import { createLogger, env } from '@/utils';

import { BotClient } from './bot-client';

const logger = createLogger('hoshizune');

const database = new Database();
const nekosBest = new NekosBest();

const botClient = new BotClient(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
    ],
  },
  database,
  nekosBest,
);

(async () => {
  logger.info('🤫 Environment variables preparing');
  await env.prepare();

  if (process.argv.includes('--rest')) {
    logger.info('🌍 REST mode selected, starting');
    await botClient.startRest();
  } else {
    // try {
    //   await database.$connect();
    //   logger.info(`🗃️ Database connected`);
    // } catch (error) {
    //   logger.error(`❌ Failed to connect database`, error);
    //   process.exit(1);
    // }

    logger.info('🤖 Bot mode selected, starting');
    await botClient.startBot();
  }
})();
