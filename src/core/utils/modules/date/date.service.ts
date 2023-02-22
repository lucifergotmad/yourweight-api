import { Injectable } from "@nestjs/common";
import { IDateUtil } from "./date.interface";
import * as moment from "moment-timezone";

@Injectable()
export class DateUtil implements IDateUtil {
  localDateString(date: Date): string {
    return moment.tz(date, "Asia/Jakarta").format("YYYY-MM-DD");
  }

  monthString(date: Date): string {
    return moment.tz(date, "Asia/Jakarta").format("YYYY-MM");
  }

  yearString(date: Date): string {
    return moment.tz(date, "Asia/Jakarta").format("YYYY");
  }

  formatDate(date: Date, dateFormat: string): string {
    return moment.tz(date, "Asia/Jakarta").format(dateFormat);
  }

  getToday(): string {
    return moment().format("YYYY-MM-DD");
  }

  startOf(
    unitOfTime: moment.unitOfTime.StartOf,
    format: string,
    date?: Date | string,
  ) {
    const tanggal = date ? new Date(date) : new Date();
    return moment
      .tz(tanggal, "Asia/Jakarta")
      .startOf(unitOfTime)
      .format(format);
  }

  endOf(
    unitOfTime: moment.unitOfTime.StartOf,
    format: string,
    date?: Date | string,
  ) {
    const tanggal = date ? new Date(date) : new Date();
    return moment.tz(tanggal, "Asia/Jakarta").endOf(unitOfTime).format(format);
  }
}
