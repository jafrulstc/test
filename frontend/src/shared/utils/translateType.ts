import { Translations } from "~/shared/services/i18n/types/translation";

function makePathProxy(path: string = ""): any {
  return new Proxy(() => {}, {
    get: (_target, prop: string | symbol) => {
      // Symbol হলে handle করব
      if (prop === Symbol.toPrimitive || prop === "toString") {
        return () => path;
      }
      const newPath = path ? `${path}.${String(prop)}` : String(prop);
      return makePathProxy(newPath);
    }
  });
}

export const tPath:Translations = makePathProxy();