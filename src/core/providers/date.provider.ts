export interface DateProvider {
  now(): Date;
}

export class DateProviderImpl implements DateProvider {
  now(): Date {
    return new Date();
  }
}
