import { Bookmark, Builder as BookmarkBuilder } from '@xiaohuohumax/bookmark';
import { Resource, getResourcesByBelongId } from '../theme/resource';

import path from 'node:path';
import fs from 'node:fs';

/**
 * 依据 belongId 创建书签树
 * @param resources 资源集合
 * @param publicDir 资源目录
 * @param belongId 归属 ID
 * @returns 
 */
function createBookmarkByBelongId(resources: Resource[], publicDir: string, belongId: string | null): Bookmark[] {
  const r = getResourcesByBelongId(resources, belongId);

  return r.map(r => {
    if (r.type === 'collection') {
      const children = createBookmarkByBelongId(resources, publicDir, r.id);
      if (children.length === 0) {
        return;
      }
      return { name: r.title, children };
    }
    return r.links.map(l => ({
      name: r.title + (r.links.length > 1 ? '-' + l.text : ''),
      href: l.link,
    }));
  }).flat().filter(b => b) as Bookmark[];
}

/**
 * 创建书签文件
 * @param resources 资源集合
 * @param publicDir 资源目录
 * @param outFile 输出文件路径
 * @param title 书签标题
 */
export function createBookmark(resources: Resource[], publicDir: string, outFile: string, title: string): void {
  const builder = new BookmarkBuilder({});

  const bms: Bookmark[] = createBookmarkByBelongId(resources, publicDir, null);

  const bookmarkHtml = builder.buildHTMLString(bms, ({ bookmark }) =>
    fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8')
      .replace(/{{\s+bookmark\s+}}/ig, () => bookmark)
      .replaceAll(/{{\s+title\s+}}/ig, () => title)
  );

  fs.writeFileSync(outFile, bookmarkHtml);
}