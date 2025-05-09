import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as userLanguageModel from "../../model/v1/language.model";
export const createUserLanguageHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { language, proficiency } = request.body;

    const newLanguage = await userLanguageModel.createUserLanguage(
      userId,
      language,
      proficiency
    );
    response.status(ResponseStatus.Created).json(newLanguage);
  } catch (error) {
    next(error);
  }
};

export const updateUserLanguageHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { language, proficiency } = request.body;

    const updatedLanguage = await userLanguageModel.updateUserLanguage(
      userId,
      language,
      proficiency
    );
    response.status(ResponseStatus.OK).json(updatedLanguage);
  } catch (error) {
    next(error);
  }
};

export const deleteUserLanguageHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { language } = request.body;

    await userLanguageModel.deleteUserLanguage(userId, language);
    response.sendStatus(ResponseStatus.NoContent);
  } catch (error) {
    next(error);
  }
};
