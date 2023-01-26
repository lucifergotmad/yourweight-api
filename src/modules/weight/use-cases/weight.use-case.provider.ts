import { Provider } from "@nestjs/common";
import { CalculateUserBMI } from "./calculate-user-bmi.use-case";
import { FindWeightByUsername } from "./find-weight-by-username.use-case";

export const weightUseCaseProvider: Provider[] = [
  FindWeightByUsername,
  CalculateUserBMI,
];
