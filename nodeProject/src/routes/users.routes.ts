import { Router } from 'express';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';


const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.get('/', async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();

  return response.json(users);
});

usersRoutes.post('/', async (request, response) => {

  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const hashedPassword = await hash(password, 8);

  const user = await createUser.execute({
    name,
    email,
    password: hashedPassword,
  })

  delete user.password;

  return response.json(user);

});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {

    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRoutes;
