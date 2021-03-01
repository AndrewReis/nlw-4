import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import SurveysRepository from '../repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;
    try {

      const surveysRepository = getCustomRepository(SurveysRepository);

      const surveys = surveysRepository.create({
        title,
        description
      });

      await surveysRepository.save(surveys);

      return response.status(201).json(surveys);
    } catch (error) {
      return response.status(400).json({ err: error });
    }
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return response.json(all);
  }
}

export default SurveysController;
