import { Messages } from './messages';

export interface ResponseBody {
  status: number;
  description: string;
  message: string;
}

export const Responses = {
  [Messages.SUCCESSFUL_OPERATION]: {
    status: 200,
    description: Messages.SUCCESSFUL_OPERATION,
    message: Messages.SUCCESS_MESSAGE,
  },
};
