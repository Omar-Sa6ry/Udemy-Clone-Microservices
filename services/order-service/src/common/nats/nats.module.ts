import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://nats-srv:4222'],
          queue: 'order-service',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
