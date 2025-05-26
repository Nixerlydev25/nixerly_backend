import { Request, Response, NextFunction } from "express";
import * as roleModel from "../../model/v1/role.model";
import { ResponseMessages, ResponseStatus } from "../../types/response.enums";
import { updateUserRoleSchema } from "../../schema/v1/role.validation";
import { NotFoundError } from "../../utils/errors";

export const updateUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id, role } = updateUserRoleSchema.parse({
      ...request.params,
      ...request.body,
    });

    const updatedUser = await roleModel.updateUserRole(id, role);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success, user: updatedUser });
  } catch (error: any) {
    return next(error);
  }
};
