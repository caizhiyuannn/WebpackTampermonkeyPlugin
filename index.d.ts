declare module 'webpack-tampermonkey-plugin' {
  interface TMPConfigType extends BaseType {
    name: string;
    version: string;
    description: string;
    author: string;
    namespace?: string;
  }
}

interface Enviroment {
  production?: Other & BaseType;
  development?: Other & BaseType;
}

interface Other {
  baseURL?: string;
  params?: string;
}
interface BaseType {
  updateURL?: string;
  downloadURL?: string;
  match: string[];
  connect?: string[];
  require?: string[];
  grant?: string[];
}
