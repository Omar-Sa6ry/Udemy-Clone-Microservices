import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NatsService {
  private readonly logger = new Logger(NatsService.name);

  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async sendMessage<T>(pattern: string, data: any): Promise<T> {
    try {
      return await this.natsClient.send(pattern, data).toPromise();
    } catch (error) {
      this.logger.error(`NATS message failed: ${pattern}`, error.stack);
      throw error;
    }
  }

  async emitEvent(pattern: string, data: any) {
    try {
      this.natsClient.emit(pattern, data);
      this.logger.log(`Event emitted: ${pattern}`);
    } catch (error) {
      this.logger.error(`NATS event failed: ${pattern}`, error.stack);
    }
  }
}
