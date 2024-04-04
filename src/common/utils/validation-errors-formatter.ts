import { WinstonLogger } from 'nest-winston';

export function formatValidationErrors(messages: string[], logger: WinstonLogger): object {
  try {
    const errorObject = messages.reduce((acc, errorMessage) => {
      const [field, ...message] = errorMessage.split(' ');

      if (!acc[field]) {
        acc[field] = [];
      }

      acc[field].push(message.join(' '));

      return acc;
    }, []);

    return errorObject;
  } catch (err) {
    logger.error(err);

    return {};
  }
}
