const role = {
  '/roles': {
    get: {
      tags: ['Role'],
      description: 'Get all roles',
      parameters: [],
      responses: {},
    },
    post: {
      tags: ['Role'],
      description: 'Create a new role',
      parameters: [],
      responses: {},
    },
  },
  '/roles/{id}': {
    put: {
      tags: ['Role'],
      description: 'Update a role',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            description: 'Role ID',
          },
        },
      ],
      requestBody: {},
      responses: {},
    },
    delete: {
      tags: ['Role'],
      description: 'Delete a role',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {},
        },
      ],
    },
  },
};

export default role;
