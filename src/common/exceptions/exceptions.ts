import { ErrorMessages } from '../response_messages/error-messages';
import { ExceptionMessages } from './exception-messages';

export interface ExceptionBody {
  status: number;
  description: string;
  message: string;
}

export const Exceptions = {
  [ExceptionMessages.NOT_FOUND]: {
    status: 404,
    description: ExceptionMessages.NOT_FOUND,
    message: ErrorMessages.NOT_FOUND,
  },
  [ExceptionMessages.UNPROCESSABLE_ENTITY]: {
    status: 422,
    description: ExceptionMessages.UNPROCESSABLE_ENTITY,
    message: ErrorMessages.UNPROCESSABLE_CONTENT,
  },
  [ExceptionMessages.ERROR_RESPONSE]: {
    status: 500,
    description: ExceptionMessages.ERROR_RESPONSE,
    message: ErrorMessages.ERROR_MESSAGE,
  },
};
