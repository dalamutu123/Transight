import { rolesRepository } from './roles.repository';

export const rolesService = {
  list() {
    return rolesRepository.findAll();
  },
};