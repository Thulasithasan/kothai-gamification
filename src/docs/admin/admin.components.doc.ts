import roleAdminDto from '@/src/docs/admin/role/role.admin.dto.doc';
import baseAdminDto from '@/src/docs/admin/base/base.admin.dto';
export default {
  components: {
    schemas: {
      ...roleAdminDto,
      ...baseAdminDto,
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer token',
      },
    },
  },
};
