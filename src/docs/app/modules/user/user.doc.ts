export default {
  '/user/list': {
    get: {
      tags: ['User'],
      description: 'App User related apis',
      parameters: [],
      responses: {
        200: {
          description: 'User were obtained',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        400: {
          description: 'Bad request response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      },
    },
  },
};
