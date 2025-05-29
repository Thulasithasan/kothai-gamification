import basicInfo from './admin.basicInfo.doc';
import servers from './admin.servers.doc';
import components from './admin.components.doc';
import adminPath from './admin.path.doc';

const adminDoc = {
  ...basicInfo,
  ...servers,
  ...components,
  ...adminPath,
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export default adminDoc;
