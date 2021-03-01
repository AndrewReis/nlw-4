import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import SurveyUserRepository from '../repositories/SurveyUserRepository';

class AnswerController {
  // http://localhost:3333/answers/10?u=238d5ab4-945c-4d00-9570-0e63cf1cab00

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u)
    });

    if (!surveyUser) {
      return response.status(400).json({ message: 'SurveyUser does not exist.' });
    }

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }

}

export default AnswerController;
