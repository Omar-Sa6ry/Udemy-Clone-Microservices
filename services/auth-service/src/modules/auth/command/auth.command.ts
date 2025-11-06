import { ChannelType, NotificationService } from '@bts-soft/core';

export class SendResetPasswordEmailCommand implements IEmailCommand {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly email: string,
    private readonly link: string,
  ) {}

  async execute(): Promise<void> {
    await this.notificationService.send(ChannelType.EMAIL, {
      recipientId: this.email,
      subject: 'Forgot Password',
      body: `Click here to reset your password: ${this.link}`,
    });
  }
}

export class SendWelcomeEmailCommand implements IEmailCommand {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly email: string,
  ) {}

  async execute(): Promise<void> {
    await this.notificationService.send(ChannelType.EMAIL, {
      recipientId: this.email,
      subject: 'Register in App',
      body: 'You registered successfully in the App',
    });
  }
}
