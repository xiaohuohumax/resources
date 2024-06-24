import pLimit from 'p-limit';
import * as puppeteer from 'puppeteer';
import ProgressBar from 'progress';

import { Doc, loadResources, RLink } from '../theme/resource';

import path from 'node:path';
import fs from 'node:fs';

// 并发限制
const LIMIT_CONCURRENCY = 26;
// 重试次数
const RETRY_COUNT = 3;
// 重试增加间隔
const RETRY_STEEP_TIME = 10_000;
// 链接基础超时时间
const BASE_TIMEOUT = 10_000;
// 检查结果文件
const CHECK_RESULT_CACHE_DIR = path.join(__dirname, '../../cache/check');
const CHECK_RESULT_CACHE_FILE = path.join(CHECK_RESULT_CACHE_DIR, 'result.json');

// 文档目录
const SRC_DIR = path.join(__dirname, '../../src');

type Link = Pick<Doc, 'title' | 'path' | 'description'> & {
  link: RLink['link']
  linkText: RLink['text']
  status: boolean
  error?: string
}

interface CheckResult {
  count: number;
  time: string;
  successCount: number;
  failCount: number;
  failLinks: Link[];
  successLinks: Link[];
}

function getNowTime(): string {
  return new Date().toLocaleString();
}

/**
 * 检查链接是否有效
 * TIMEOUT = BASE_TIMEOUT + retry * RETRY_STEEP_TIME
 * @param link 链接
 * @param browser 浏览器
 * @returns 
 */
export async function checkLink(link: string, browser: puppeteer.Browser): Promise<[boolean, Error?]> {
  let error: Error | undefined = undefined;
  for (let i = 1; i <= RETRY_COUNT; i++) {
    const page = await browser.newPage();
    try {
      const response = await page.goto(link, {
        waitUntil: 'domcontentloaded',
        timeout: BASE_TIMEOUT + i * RETRY_STEEP_TIME,
      });

      if (response == null) {
        throw new Error(`Failed to fetch ${link}`);
      } else if (!response.ok()) {
        throw new Error(`Failed to fetch ${link} with status code ${response.status()}`);
      }
      return [true, error];
    } catch (err) {
      error = err as Error;
    }
    await page.close();
  }
  return [false, error];
}

/**
 * 检查链接列表
 * @param links 链接列表
 */
async function check(links: Link[]): Promise<CheckResult> {
  console.log('Start check links...');

  const msg = 'Check :status [:current/:total] :msg :percent :etas';
  const bar: ProgressBar = new ProgressBar(msg, {
    total: links.length
  });

  const limit = pLimit(LIMIT_CONCURRENCY);

  const browser = await puppeteer.launch({
    // headless: false,
    // args: ['--start-maximized'],
  });

  await Promise.all(links.map(link => limit(async (l) => {
    bar.tick(0, {
      msg: `${l.title}(${l.linkText})`,
      status: 'start'
    });

    const [status, error] = await checkLink(link.link, browser);
    link.status = status;
    link.error = error?.message;

    bar.tick({
      msg: `${l.title}(${l.linkText})`,
      status: status ? 'success' : 'fail'
    });
  }, link)));

  await browser.close();

  const failLinks = links.filter(l => !l.status);
  const successLinks = links.filter(l => l.status);

  if (failLinks.length === 0) {
    console.log('\nAll links are valid!');
  } else {
    // 检查失败的链接
    console.log('\nFailed links:');
    console.table(failLinks, ['title', 'linkText', 'error']);
  }

  const result: CheckResult = {
    count: links.length,
    time: getNowTime(),
    failCount: failLinks.length,
    successCount: successLinks.length,
    failLinks,
    successLinks,
  };

  return result;
}

/**
 * 检查所有文档中的链接是否有效
 */
async function checkWithScan(): Promise<CheckResult> {
  const docs: Doc[] = loadResources(SRC_DIR, [])
    .filter(r => r.type === 'doc') as Doc[];

  const links: Link[] = docs.map(doc => {
    return doc.links.map(l => ({
      title: doc.title,
      path: doc.path,
      description: doc.description,
      link: l.link,
      linkText: l.text,
      status: false,
    }));
  }).flat(1);

  if (docs.length === 0) {
    throw new Error(`No links found: ${SRC_DIR}.`);
  }

  return await check(links);
}

/**
 * 检查缓存中的失败链接
 */
async function checkWithCache(): Promise<CheckResult> {
  if (!fs.existsSync(CHECK_RESULT_CACHE_FILE)) {
    throw new Error('No cache found, please run `npm run check` first.');
  }

  const cache: CheckResult = JSON.parse(fs.readFileSync(CHECK_RESULT_CACHE_FILE, 'utf-8'));
  if (cache.failLinks.length === 0) {
    console.log('All links are valid!');
    cache.time = getNowTime();
    return cache;
  }

  const res = await check(cache.failLinks);
  return {
    count: cache.count,
    time: res.time,
    failCount: res.failCount,
    successCount: res.successCount + cache.successCount,
    failLinks: res.failLinks,
    successLinks: [...cache.successLinks, ...res.successLinks],
  };
}

async function main() {
  let result;

  if (process.argv.length > 2 && process.argv[2] === '--cache') {
    console.log('Checking with cache...\n');
    result = await checkWithCache();
  } else {
    console.log('Checking with scan...\n');
    result = await checkWithScan();
  }

  // 保存检查结果
  if (!fs.existsSync(CHECK_RESULT_CACHE_DIR)) {
    fs.mkdirSync(CHECK_RESULT_CACHE_DIR, { recursive: true });
  }

  fs.writeFileSync(CHECK_RESULT_CACHE_FILE, JSON.stringify(result, null, 2));
  console.log(`\nCheck result saved to ${CHECK_RESULT_CACHE_FILE}`);
}

main().catch((err) => console.log(err.message));