import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    try {

      const userRepository = getRepository(User);

      const userAlreadyExist = await userRepository.findOne({
        where: { email }
      });

      if (userAlreadyExist) {
        return response.status(400).json({ message: 'User Already exist.' });
      }

      const user = userRepository.create({
        name,
        email
      });

      await userRepository.save(user);

      return response.status(201).json(user);
    } catch (error) {
      return response.status(400).json({ err: error });
    }
  }
}

export default UserController;
