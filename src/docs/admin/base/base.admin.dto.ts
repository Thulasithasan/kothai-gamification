const BaseAdminDTO = {
  BaseResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'boolean',
        description: 'Status of the request',
        example: true,
      },
    },
  },
  UnauthorizedError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Unauthorized error message',
        example: 'Unauthorized',
      },
    },
  },
  CreatedUpdatedResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Id of the created or updated entry',
      },
    },
  },
};

export default BaseAdminDTO;
