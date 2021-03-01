import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import SurveyUserRepository from '../repositories/SurveyUserRepository';

class NpsController {

  /**
   * 1 2 3 4 5 6 7 8 9 10
   * DETRATORES => 0 - 6
   * PASSIVOS => 7 - 8
   * PROMOTORES => 9 - 10
   * respondentes => todos que votaram.
   * 
   * Calculo:
   * ( promotores - detratores ) / ( respondentes ) * 100
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveyUser.filter(
      survey => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveyUser.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveyUser.length;

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractor,
      promoters,
      totalAnswers,
      calculate
    });
  }

}

export default NpsController;
