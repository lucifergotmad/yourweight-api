import { AggregateRoot } from "src/core/base-classes/domain/aggregate-root";

export interface WeightCardProps {
  username: string;
  date: Date;
  weight: number;
  photo?: string;
  comment?: string;
}

export class WeightCardEntity extends AggregateRoot<WeightCardProps> {
  constructor(props: WeightCardProps) {
    super(props);
  }

  static create(props: WeightCardProps) {
    return new WeightCardEntity(props);
  }
}
