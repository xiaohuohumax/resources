import { Plugin } from 'vite';
import { cut } from '@node-rs/jieba';

/**
 * 本地搜索切词增强插件(优化中文搜索)
 * @param localeId 语言标识ID
 * @returns 
 */
export default function (localeId: string): Plugin {
  return {
    name: 'vitepress:local-search-cut',
    transform(code, id) {
      // 搜索数据来源虚拟模块 `@localSearchIndex${localesId}` 固定前缀 @localSearchIndex + 语言标识ID
      if (id.includes(`@localSearchIndex${localeId}`)) {
        const data = JSON.parse(JSON.parse(code.slice(15)));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const indexMap: { [key: string]: any } = {};

        for (const [key, value] of data.index) {
          indexMap[key] = value;
        }

        for (const indexItem of data.index) {
          // 对原词再切词
          for (const cutWord of cut(indexItem[0])) {
            // 克隆原词对应数据
            const cloneItem = JSON.parse(JSON.stringify(indexItem[1]));

            if (cutWord in indexMap) {
              // 合并相同切词数据
              for (const [key, value] of Object.entries(cloneItem)) {
                indexMap[cutWord][key] = Object.assign(indexMap[cutWord][key] ?? {}, value);
              }
            } else {
              indexMap[cutWord] = cloneItem;
            }
          }
        }

        data.index = Object.entries(indexMap);

        return `export default ${JSON.stringify(JSON.stringify(data))}`;
      }
    }
  };
}