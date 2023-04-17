import { faker } from '@faker-js/faker';

import { PASSWORD } from '../types';

type TSignUpFormData = {
  username: string,
  email: string,
  password: string,
};

const getUserSignUpData = (emailDomain = 'test.dev'): TSignUpFormData => {
  const name = faker.name.firstName();

  return {
    username: name,
    email: faker.internet.email(name, '', emailDomain),
    password: PASSWORD,
  };
};

const auth = {
  getUserSignUpData,
};

export {
  auth,
};
