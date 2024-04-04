import { QueryFailedError } from 'typeorm';

export class DatabaseErrorMessageParser {
  static parseMessage(exception: QueryFailedError): string {
    const regex = /\((.*?)\)/;
    const fieldName = regex.exec(exception?.driverError?.detail)?.[1];

    return fieldName;
  }
}
