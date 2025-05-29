import basicInfo from './app.basicInfo.doc';
import servers from './app.servers.doc';
import components from './app.components.doc';
import appPath from './app.path.doc';

const appDoc = {
  ...basicInfo,
  ...servers,
  ...components,
  ...appPath,
};

export default appDoc;
