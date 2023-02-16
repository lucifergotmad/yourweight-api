import { Provider } from "@nestjs/common";
import { RegisterUser } from "./register-user.use-case";
import { DeleteUser } from "./delete-user.use-case";
import { FindUserById } from "./find-user-by-id.use-case";
import { UpdateUser } from "./update-user.use-case";
import { ConfirmUserAccount } from "./confirm-user-accout.use-case";
import { CheckUsername } from "./check-username.use-case";

export const userUseCaseProvider: Provider[] = [
  ConfirmUserAccount,
  RegisterUser,
  FindUserById,
  DeleteUser,
  UpdateUser,
  CheckUsername,
];
