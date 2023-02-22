export interface IDateUtil {
  localDateString(date: Date): string;
  monthString(date: Date): string;
  yearString(date: Date): string;
  formatDate(date: Date, dateFormat: string): string;
  getToday(): string;
  startOf(
    unitOfTime: moment.unitOfTime.StartOf,
    format: string,
    date?: Date | string,
  ): string;
  endOf(
    unitOfTime: moment.unitOfTime.StartOf,
    format: string,
    date?: Date | string,
  ): string;
  incrementDate(
    amount: number,
    unitOfTime: moment.unitOfTime.DurationConstructor,
    date?: Date | string,
  ): string;
  decrementDate(
    amount: number,
    unitOfTime: moment.unitOfTime.DurationConstructor,
    date?: Date | string,
  ): string;
}
