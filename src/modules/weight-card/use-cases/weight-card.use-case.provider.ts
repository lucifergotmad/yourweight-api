import { Provider } from "@nestjs/common";
import { CreateWeightCard } from "./create-weight-card.use-case";

export const weightCardUseCaseProvider: Provider[] = [CreateWeightCard];
