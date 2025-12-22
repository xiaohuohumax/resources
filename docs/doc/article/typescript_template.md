---
layout: article
title: TypeScript 项目模板
description: 自用 TypeScript 项目模板，快速搭建一个 TypeScript 空项目。
icon: typescript_template.svg
tags:
  - TypeScript
  - 模板
id: b15186472462c4ff1e574beffafdd349
---

## 前言

自用 TypeScript 项目模板，快速搭建一个 TypeScript 空项目。

## 功能

+ eslint：代码风格检查
+ commitlint：提交信息规范检查
+ pnpm：包管理工具
+ changeset：版本管理工具

## 基础依赖

<RRelatedView id="35922e394326f3c8c1f16d70d767f93d" alt="pnpm" />
<RRelatedView id="44ba2ca3ed9b6c720bb7f5ebdb6cec6c" alt="@antfu/eslint-config" />
<RRelatedView id="1c5b44d5a9acd7a87f9918bb8379faa2" alt="changesets" />
<RRelatedView id="df1dff70ff8399f2bc1248f18044b682" alt="commitizen" />
<RRelatedView id="04ec603f9632b68666961eadeeed368d" alt="eslint" />
<RRelatedView id="5a3dd216b91410e6ee8aadf6049d9d97" alt="cz-git" />
<RRelatedView id="b5e531db65900fe510a58f7c7a747497" alt="simple-git-hooks" />

## 项目结构

```
typescript-template
 ├── commitlint.config.mjs
 ├── eslint.config.mjs
 ├── LICENSE
 ├── package.json
 ├── pnpm-lock.yaml
 ├── pnpm-workspace.yaml
 ├── src
 │   └── index.ts
 └── tsconfig.json
```

## 文件内容

+ `package.json`

```json
{
  "name": "typescript-template",
  "type": "module",
  "version": "1.0.0",
  "packageManager": "pnpm@10.26.1",
  "description": "Typescript template",
  "author": {
    "name": "xiaohuohumax",
    "url": "https://github.com/xiaohuohumax"
  },
  "license": "MIT",
  "scripts": {
    "commit": "git add . && cz",
    "postinstall": "simple-git-hooks",
    "changeset": "changeset",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^6.7.1",
    "@changesets/cli": "^2.29.8",
    "@commitlint/config-conventional": "^20.2.0",
    "commitizen": "^4.3.1",
    "cz-git": "^1.12.0",
    "eslint": "^9.39.2",
    "simple-git-hooks": "^2.13.1"
  },
  "simple-git-hooks": {
    "commit-msg": "pnpx commitlint --edit $1",
    "pre-commit": "pnpm lint:fix && git add ."
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

+ `commitlint.config.mjs`

```typescript
import { defineConfig } from 'cz-git'

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'init',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'revert',
        'chore',
        'chore(deps)',
        'chore(release)',
        'chore(submodule)',
      ],
    ],
  },
  prompt: {
    messages: {
      type: '选择你要提交的类型：',
      scope: '选择一个提交范围（可选）：',
      customScope: '请输入自定义的提交范围：',
      subject: '填写简短精炼的变更描述：\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
      markBreaking: '是否为非兼容性重大的变更（开头添加 "!"）？',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行：\n',
      footerPrefixesSelect: '选择关联 issue 前缀（可选）：',
      customFooterPrefix: '输入自定义 issue 前缀：',
      footer: '列举关联 issue（可选）例如：#31, #I3244：\n',
      confirmCommit: '是否提交或修改 commit ？',
    },
    types: [
      { value: 'feat', name: '✨ 新增功能 [feat] A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: '🐛 修复缺陷 [fix] A bug fix', emoji: ':bug:' },
      { value: 'init', name: '🎉 初始项目 [init] Initial commit', emoji: ':tada:' },
      { value: 'docs', name: '📝 文档更新 [docs] Documentation only changes', emoji: ':memo:' },
      { value: 'style', name: '💄 代码格式 [style] Changes that do not affect the meaning of the code', emoji: ':lipstick:' },
      { value: 'refactor', name: '♻️  代码重构 [refactor] A code change that neither fixes a bug nor adds a feature', emoji: ':recycle:' },
      { value: 'perf', name: '⚡️ 性能提升 [perf] A code change that improves performance', emoji: ':zap:' },
      { value: 'test', name: '✅ 测试相关 [test] Adding missing tests or correcting existing tests', emoji: ':white_check_mark:' },
      { value: 'build', name: '📦️ 构建相关 [build] Changes that affect the build system or external dependencies', emoji: ':package:' },
      { value: 'ci', name: '🎡 持续集成 [ci] Changes to our CI configuration files and scripts', emoji: ':ferris_wheel:' },
      { value: 'revert', name: '🔨 回退代码 [revert] Revert to a commit', emoji: ':hammer:' },
      { value: 'chore', name: '⏪️ 其他修改 [chore] Other changes that do not modify src or test files', emoji: ':rewind:' },
      { value: 'chore(deps)', name: '🔧 依赖更新 [chore(deps)] Update dependencies', emoji: ':wrench:' },
      { value: 'chore(release)', name: '🔖 版本发布 [chore(release)] Release a new version', emoji: ':bookmark:' },
      { value: 'chore(submodule)', name: '🔺 添加模块 [chore(submodule)] Add a new submodule', emoji: ':triangular_ruler:' },
    ],
    useEmoji: true,
    issuePrefixes: [
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
    ],
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
})
```

+ `eslint.config.mjs`

```typescript
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
})
```

+ `pnpm-workspace.yaml`

```yaml
shellEmulator: true

trustPolicy: no-downgrade

onlyBuiltDependencies:
  - simple-git-hooks
```

+ `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "sourceMap": true,
    "skipLibCheck": true
  }
}
```
