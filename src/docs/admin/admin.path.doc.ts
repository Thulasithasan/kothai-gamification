import role from '@/src/docs/admin/role/role.admin.doc';

// TODO refactor
const createUpdateRequestBody = (tagName: string) => ({
  content: {
    'application/json': {
      schema: {
        $ref: `#/components/schemas/CreateUpdate${tagName}Request`, // Dynamically referring to Create<tagname>Request
      },
    },
  },
  required: true,
});

const listResponse = (tagName: string) => ({
  200: {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: `#/components/schemas/${tagName}ListResponse`,
        },
      },
    },
  },
});

const unauthorizedErrorResponse = {
  401: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/UnauthorizedError',
        },
      },
    },
  },
};

const createdResponse = {
  201: {
    description: 'Entry created successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreatedUpdatedResponse',
        },
      },
    },
  },
};

const updatedResponse = {
  200: {
    description: 'Entry updated successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreatedUpdatedResponse',
        },
      },
    },
  },
};

const deleteResponse = {
  200: {
    description: 'Entry deleted successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/BaseResponse',
        },
      },
    },
  },
};

const adminPath: any = {
  paths: {
    ...role,

  },
};

Object.keys(adminPath.paths).forEach((path) => {
  Object.keys(adminPath.paths[path]).forEach((method) => {
    const currentMethod = adminPath.paths[path][method];
    const tagName = currentMethod.tags && currentMethod.tags[0];
    if (method === 'get') {
      currentMethod.responses = {
        ...currentMethod.responses,
        ...listResponse(tagName),
      };
    } else if (method === 'post' || method === 'put') {
      // Apply common requestBody for POST requests
      if (tagName) {
        currentMethod.requestBody = createUpdateRequestBody(tagName);
      }
      const response =
        method === 'post' ? createdResponse : updatedResponse;
      currentMethod.responses = {
        ...currentMethod.responses,
        ...response,
      };
    } else if (method === 'delete') {
      currentMethod.responses = {
        ...currentMethod.responses,
        ...deleteResponse,
      };
    }
    currentMethod.responses = {
      ...currentMethod.responses,
      ...unauthorizedErrorResponse, // Add the 401 error response
    };
  });
});

export default adminPath;
