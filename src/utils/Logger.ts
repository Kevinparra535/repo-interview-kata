/**
 * Logger class for logging messages with different types.
 */
class Logger {
  private layer: string;

  constructor(layer: string) {
    this.layer = layer;
  }

  private log(message: string, type: 'info' | 'error' | 'debug' | 'warn') {
    const formattedMessage = `[${this.layer}] [${type.toUpperCase()}] ${message}`;

    switch (type) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.info(formattedMessage);
        break;
    }
  }

  info(message: string) {
    this.log(message, 'info');
  }

  error(message: string) {
    this.log(message, 'error');
  }

  debug(message: string) {
    this.log(message, 'debug');
  }

  warn(message: string) {
    this.log(message, 'warn');
  }
}

export default Logger;
