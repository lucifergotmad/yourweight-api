import { ControllerProperty } from "src/core/decorators/controller-decorators/class-decorators/controller-property.decorator";

@ControllerProperty("v1/weights", "Weights")
export class WeightController {
  constructor() {
    // fill above parentheses with use case / repository dependencies
  }
}
