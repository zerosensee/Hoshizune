import { createLogger } from '@/utils';
import { Prisma, PrismaClient } from '@prisma/generated';

export class Database extends PrismaClient<
  Prisma.PrismaClientOptions,
  'info' | 'warn' | 'error'
> {
  private readonly logger = createLogger('database');

  private isReconnecting = false;

  public constructor() {
    super({
      log: (['info', 'warn', 'error'] as Prisma.LogLevel[]).map((level) => ({
        level,
        emit: 'event',
      })),
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.$on('info', (event: Prisma.LogEvent) =>
      this.logger.info(event.message),
    );
    this.$on('warn', (event: Prisma.LogEvent) =>
      this.logger.warn(event.message),
    );
    this.$on('error', (event: Prisma.LogEvent) => {
      this.logger.error(event.message);

      if (event.message.includes('connection')) {
        void this.handleDisconnect();
      }
    });
  }

  private async handleDisconnect() {
    if (this.isReconnecting) return;

    this.isReconnecting = true;

    while (true) {
      this.logger.error('Failed to connect to the database, retrying...');

      try {
        await this.$connect();
        this.logger.info('Successfully reconnected to the database');
        this.isReconnecting = false;
        break;
      } catch (error) {
        this.logger.error(
          `Failed to reconnect to the database: ${(error as Error).message}`,
        );
      }
    }
  }
}
