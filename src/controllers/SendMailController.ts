import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import SurveysRepository from '../repositories/SurveysRepository';
import UserRepository from '../repositories/UserRepository';
import SurveyUserRepository from '../repositories/SurveyUserRepository';

import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);


    const userAlreadyExist = await userRepository.findOne({ email });

    if (!userAlreadyExist) {
      return response.status(400).json({ error: 'User does not exist.' });
    }

    const surveyAlreadyExist = await surveysRepository.findOne({ id: survey_id });

    if (!surveyAlreadyExist) {
      return response.status(400).json({ error: 'Survey does not exist.' });
    }

    const user = userAlreadyExist;
    const survey = surveyAlreadyExist;

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExist = await surveyUserRepository.findOne({
      where: { user_id: user.id },
      relations: ['user', 'survey']
    });

    const variables = {
      name: user.name,
      id: '',
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExist) {
      variables.id = surveyUserAlreadyExist.id
      await SendMailService.execute(email, survey.description, variables, npsPath);
      return response.json(surveyUserAlreadyExist);
    }

    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveyUserRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.description, variables, npsPath);

    return response.json(surveyUser);
  }
}

export default SendMailController;
