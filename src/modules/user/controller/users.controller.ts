import { Body, Get, Param, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse } from "@nestjs/swagger";
import { APIQueryProperty } from "src/core/decorators/controller-decorators/class-decorators/api-query-property.decorator";
import { ControllerProperty } from "src/core/decorators/controller-decorators/class-decorators/controller-property.decorator";
import { SecureDelete } from "src/core/decorators/controller-decorators/class-decorators/secure-delete.decorator";
import { SecureGet } from "src/core/decorators/controller-decorators/class-decorators/secure-get.decorator";
import { SecurePut } from "src/core/decorators/controller-decorators/class-decorators/secure-put.decorator";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { DeleteUser } from "src/modules/user/use-cases/delete-user.use-case";
import { UpdateUser } from "src/modules/user/use-cases/update-user.use-case";
import { UserMongoEntity } from "../database/model/user.mongo-entity";
import { InjectUserRepository } from "../database/user.repository.provider";
import { UserRepository } from "../database/user.repository.service";
import { CheckUsername } from "../use-cases/check-username.use-case";
import { FindAllUser } from "../use-cases/find-all-user.use-case";
import { FindUserById } from "../use-cases/find-user-by-id.use-case";
import { CheckUsernameRequestDTO } from "./dtos/check-username.request.dto";
import { UpdateUserRequestDTO } from "./dtos/update-user.request.dto";
import { UserResponseDTO } from "./dtos/user.response.dto";

@ControllerProperty("v1/users", "[Master] Users")
export class UsersController {
  constructor(
    private readonly deleteUser: DeleteUser,
    private readonly updateUser: UpdateUser,
    private readonly findUserById: FindUserById,
    private readonly checkUsername: CheckUsername,
    private readonly findAllUser: FindAllUser,
  ) {}

  @Get()
  @ApiOkResponse({ type: UserResponseDTO, isArray: true })
  async findAll() {
    return this.findAllUser.execute();
  }

  @Get("check/:username")
  @ApiOkResponse({ type: MessageResponseDTO })
  checkHandler(@Param() param: CheckUsernameRequestDTO) {
    return this.checkUsername.execute(param);
  }

  @SecureGet(":_id")
  @ApiBadRequestResponse({ description: "Bad Request (ID not valid)" })
  @ApiOkResponse({ type: UserResponseDTO })
  findOne(@Param("_id") id: string) {
    return this.findUserById.execute(id);
  }

  @SecurePut(":_id")
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiBadRequestResponse({ description: "Bad Request (ID not valid)" })
  update(@Param("_id") _id: string, @Body() body: UpdateUserRequestDTO) {
    return this.updateUser.execute({ _id, ...body });
  }

  @SecureDelete(":_id")
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiBadRequestResponse({ description: "Bad Request (ID not valid)" })
  remove(@Param("_id") id: string) {
    return this.deleteUser.execute(id);
  }
}
