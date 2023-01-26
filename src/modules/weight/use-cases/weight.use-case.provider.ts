import { Provider } from "@nestjs/common";
import { FindWeightByUsername } from "./find-weight-by-username.use-case";

export const weightUseCaseProvider: Provider[] = [FindWeightByUsername];
