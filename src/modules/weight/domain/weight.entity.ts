import { AggregateRoot } from "src/core/base-classes/domain/aggregate-root";

export interface IWeightProps {
  username: string;
  weight: number;
  height: number;
  age: number;
  target?: number;
}

export class WeightEntity extends AggregateRoot<IWeightProps> {
  constructor(props: IWeightProps) {
    super(props);
  }

  static create(props: IWeightProps) {
    return new WeightEntity(props);
  }
}
