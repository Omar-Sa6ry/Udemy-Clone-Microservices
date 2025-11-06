interface IEmailCommand {
  execute(): Promise<void>;
}
