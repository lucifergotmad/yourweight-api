import { AggregateRoot } from "src/core/base-classes/domain/aggregate-root";
import { Password } from "./value-objects/password.value-object";

export interface IDetailUserProps {
  weight: number;
  height: number;
  age: number;
  target?: number;
}
export interface IUserProps extends IDetailUserProps {
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
      email: props.email,
      username: props.username,
      password: password,
      confirmationCode: props.confirmationCode,
      weight: props.weight,
      height: props.height,
      age: props.age,
      target: props?.target,
      is_confirmed: props.is_confirmed,
    });
  }
}
