import { AppAuthModule } from "./app/app-auth.module";
import { UserModule } from "./user/user.module";
import { WeightCardModule } from "./weight-card/weight-card.module";
import { WeightModule } from "./weight/weight.module";

const systemProviders = [
  AppAuthModule,
  UserModule,
  WeightModule,
  WeightCardModule,
];

export const resourceProviders = [...systemProviders];
