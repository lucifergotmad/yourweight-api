import { AggregateRoot } from "src/core/base-classes/domain/aggregate-root";
import { Password } from "./value-objects/password.value-object";

export interface IUserProps {
  email: string;
  username: string;
  password: Password;
  confirmationCode: string;
  is_confirmed: boolean;
}

export interface UserFactoryProps extends Omit<IUserProps, "password"> {
  password: string;
}

export class UserEntity extends AggregateRoot<IUserProps> {
  constructor(props: IUserProps) {
    super(props);
  }

  static async create(props: UserFactoryProps) {
    const password = await Password.create(props.password);

    return new UserEntity({
      ...props,
      password,
    });
  }
}
