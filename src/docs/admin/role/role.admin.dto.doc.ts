const roleAdminDto = {
  Role: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Role identification number',
      },
      name: {
        type: 'string',
        description: 'Role name',
        example: 'Administrator',
      },
      type: {
        type: 'string',
        enum: ['ADMIN', 'USER'],
        description: 'Role type',
        example: 'ADMIN',
      },
      description: {
        type: 'string',
        description: 'The description of the role',
        example: 'Administrator role with all permissions',
      },
    },
  },
  RoleListResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'boolean',
        description: 'True if the request is successful',
        example: true,
      },
      total: {
        type: 'number',
        description: 'Total number of roles',
        example: 3,
      },
      roles: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Role', // Reference to the Role schema
        },
        description: 'List of roles',
      },
    },
  },
  CreateUpdateRoleRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Role name',
        example: 'Administrator',
      },
      type: {
        type: 'string',
        enum: ['ADMIN', 'USER'],
        description: 'Role type',
        example: 'ADMIN',
      },
      description: {
        type: 'string',
        description: 'The description of the role',
        example: 'Administrator role with all permissions',
      },
    },
  },
};

export default roleAdminDto;
