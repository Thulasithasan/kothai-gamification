import RoleService from '@/modules/user/service/role.service';
import UserRepository from '@/modules/user/data/repository/user.repository';
import {
  RoleDTO,
  RoleModel,
} from '../../../../src/modules/user/data/dtos/role.dto';
import { UserModel } from '../../../../src/modules/user/data/dtos/user.dto';
import BaseRepository from '../../../../src/modules/base/data/repository/base.repository';
import { RoleTypeEnum } from '../../../../src/modules/user/enums/role';

jest.mock('@/modules/user/data/repository/user.repository');

const mockMongoId = '65b1370aec980cfa0ddfd6ee';

const mockUser = {
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
} as UserModel;

const mockRole = {
  id: mockMongoId,
  type: RoleTypeEnum.ADMIN,
  name: 'Administrator',
  description: 'Administrator role with all permissions',
} as { type: RoleTypeEnum; description: string; name: string };

describe('RoleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoles', () => {
    it('should return a list of roles', async () => {
      // Mock the repository call
      const findRolesMock = jest
        .spyOn(BaseRepository, 'findAll')
        .mockResolvedValue({
          totalCount: 3,
          items: [
            { id: '1', type: RoleTypeEnum.ADMIN } as RoleModel,
            { id: '2', type: RoleTypeEnum.ADMIN } as RoleModel,
          ],
        });

      const listReq = { skip: 1, limit: 10 };
      const response = await RoleService.getRoles(listReq);

      expect(response.status).toBe(true);
      expect(response.totalCount).toBe(3);
      expect(response.roles.length).toBe(2);
      expect(findRolesMock).toHaveBeenCalledWith(
        RoleDTO,
        { isDeleted: false },
        listReq.skip,
        listReq.limit
      );
    });
  });

  // Tests for getRole function
  describe('getRole', () => {
    it('should return a role by id', async () => {
      const findByIdMock = jest
        .spyOn(BaseRepository, 'findById')
        .mockResolvedValue({
          id: mockMongoId,
          type: RoleTypeEnum.ADMIN,
        } as RoleModel);
      const response = await RoleService.getRole(mockMongoId);
      expect(response.status).toBe(true);
      expect(response.role).toEqual({
        id: mockMongoId,
        type: RoleTypeEnum.ADMIN,
      });
      expect(findByIdMock).toHaveBeenCalledWith(RoleDTO, mockMongoId);
    });

    it('should throw an error when role is not found', async () => {
      const findByIdMock = jest
        .spyOn(BaseRepository, 'findById')
        .mockResolvedValue(null);

      await expect(RoleService.getRole(mockMongoId)).rejects.toThrow(
        `Role not found for id ${mockMongoId}`
      );
      expect(findByIdMock).toHaveBeenCalledWith(RoleDTO, mockMongoId);
    });
  });

  // Tests for createRole function
  // describe('createRole', () => {
  //   it('should create a new role', async () => {
  //     const createRoleMock = jest.spyOn(BaseRepository, 'create').mockResolvedValue('new-role-id');
  //
  //     const roleData = {
  //       name: 'Administrator',
  //       type: 'admin',
  //       description: 'Administrator role with all permissions'
  //     };
  //     const response = await RoleService.createRole(roleData);
  //
  //     expect(response.status).toBe(true);
  //     expect(response.id).toBe('new-role-id');
  //     expect(createRoleMock).toHaveBeenCalledWith(RoleDTO, roleData);
  //     });
  //
  //   it('should throw an error when type is not passed', async () => {
  //       const mockRole = {
  //         name: 'Administrator',
  //         description: 'Administrator role with all permissions',
  //       } as any;
  //       await expect(async () => {
  //         await RoleService.createRole(mockRole);
  //       }).rejects.toThrow('Type is required');
  //     });
  // });

  // Tests for updateRole function
  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const updateRoleMock = jest
        .spyOn(BaseRepository, 'updateById')
        .mockResolvedValue(mockRole);

      const response = await RoleService.updateRole(
        mockMongoId,
        mockRole
      );

      expect(response.status).toBe(true);
      expect(response.id).toBe(mockMongoId);
      expect(updateRoleMock).toHaveBeenCalledWith(
        RoleDTO,
        mockMongoId,
        mockRole
      );
    });

    // it('should throw an error when validation fails', async () => {
    //   const updateRoleValidatorMock = jest.spyOn(RoleValidator, 'createUpdateRoleValidator').mockReturnValue({ error: { message: 'Invalid role data' } } as Joi.ValidationResult);
    //   await expect(RoleService.updateRole(mockMongoId, mockRole)).rejects.toThrow('Invalid role data');
    //   expect(updateRoleValidatorMock).toHaveBeenCalledWith(mockRole);
    // });

    // it('should throw an error when update fails', async () => {
    //   jest.spyOn(BaseRepository, 'updateById').mockResolvedValue(null);

    //   await expect(RoleService.updateRole(mockMongoId, mockRole)).rejects.toThrow('update fail');
    // });
  });

  // Tests for softDelete function
  describe('softDelete', () => {
    it('should soft delete a role', async () => {
      const findByRoleMock = jest
        .spyOn(UserRepository, 'findByRole')
        .mockResolvedValue(null);
      const softDeleteByIdMock = jest
        .spyOn(BaseRepository, 'softDeleteById')
        .mockResolvedValue({
          id: '1',
          type: RoleTypeEnum.ADMIN,
        } as RoleModel);

      const response = await RoleService.softDelete(mockMongoId);

      expect(response.status).toBe(true);
      expect(findByRoleMock).toHaveBeenCalledWith(mockMongoId);
      expect(softDeleteByIdMock).toHaveBeenCalledWith(
        RoleDTO,
        mockMongoId
      );
    });

    it('should throw an error when role is in use', async () => {
      const findByRoleMock = jest
        .spyOn(UserRepository, 'findByRole')
        .mockResolvedValue(mockUser);

      await expect(
        RoleService.softDelete(mockMongoId)
      ).rejects.toThrow('This Role is already in use');
      expect(findByRoleMock).toHaveBeenCalledWith(mockMongoId);
    });

    it('should throw an error when soft delete fails', async () => {
      jest
        .spyOn(UserRepository, 'findByRole')
        .mockResolvedValue(null);
      jest
        .spyOn(BaseRepository, 'softDeleteById')
        .mockRejectedValue(new Error('Delete failed'));

      await expect(
        RoleService.softDelete(mockMongoId)
      ).rejects.toThrow('Delete failed');
    });
  });
});
