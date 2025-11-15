# Repository Guidelines

## 项目结构与模块组织
代码主体位于 `src/`，其中 `components/`、`layouts/` 与 `pages/` 承担 UI 结构，`content/` 保存 Markdown/MDX 文章并由 `content.config.ts` 约束前置字段，`utils/` 与 `plugins/` 提供可复用逻辑。`public/` 放置未经处理的静态资源，`assets/` 收录主题插画与字体素材，`scripts/` 存放 `new-post.ts`、`apply-lqip.ts` 等运维脚本。构建产物输出至 `dist/`，不要手动编辑。需要调整依赖补丁时更新 `patches/`，全局样式与 UnoCSS 预设分别位于 `src/styles/` 与 `uno.config.ts`。若需要修改 Astro 行为，可在 `astro.config.ts` 中设置集成插件，同时保持 `tsconfig.json` 中的别名与类型推断同步。

## 构建、测试与本地开发命令
在首次贡献前运行 `pnpm install` 以匹配锁定版本。`pnpm dev` 会先执行 `astro check` 再启动本地开发服务器；`pnpm build` 在 CI 中使用，用于生成生产静态文件并附带 LQIP 处理；`pnpm preview` 用于复核打包结果。质量相关脚本包括 `pnpm lint`、`pnpm lint:fix` 以及 `pnpm format-posts`（对文章进行自动排版检查）。内容维护脚本有 `pnpm new-post`（按模版创建文章草稿）与 `pnpm apply-lqip`（批量生成低分辨率占位图）。发布主题更新前请运行 `pnpm update-theme` 确认外部依赖同步；CI 默认执行 `pnpm build` + `pnpm lint`，本地贡献者也应在推送前复现同样的指令集。

## 编码风格与命名约定
项目使用 TypeScript、Astro 与 UnoCSS；统一采用 2 空格缩进，避免混用 Tab。Astro 组件与 TypeScript 组件文件名使用 PascalCase（如 `Header.astro`），工具函数沿用小驼峰命名，内容文件倾向于 `kebab-case`。路径引用应使用 `@/` 别名指向 `src/`，避免相对路径层级膨胀。样式优先使用 UnoCSS 原子类或 `uno.config.ts` 中的主题 token，若使用 `src/styles/` 下的全局 CSS，请在文件顶部注明作用范围。ESLint 由 `@antfu/eslint-config` 与 `eslint.config.mjs` 驱动，提交前会通过 `simple-git-hooks` 自动运行 `lint-staged`，因此请保持代码可通过 `pnpm lint` 与 `astro check`。

## 测试与质量保证
目前未启用独立的单元或端到端测试框架，质量门槛主要依赖 `astro check` 的类型校验与 ESLint。若新增工具函数或插件，优先编写可复用的调试脚本或在 `scripts/` 下添加独立的断言逻辑，并在 PR 描述中说明覆盖范围。提交前请至少执行一次 `pnpm build` 以捕捉 Astro 编译期错误，并在浏览器中使用 `pnpm dev` 逐页验证；涉及国际化或 feed 输出的更改，请附带手动测试清单，涵盖多语言切换和 RSS 生成结果。

## 提交与 Pull Request 指南
Git 历史偏好 `type: subject` 的前缀格式，例如 `refactor: cache function type definition`；请按功能拆分提交，并避免无意义的单字描述。推荐分支命名 `feat/*`、`fix/*` 或 `chore/*`，便于自动化过滤。PR 需包含：变更概述、动机背景、主要命令输出或截图（尤其是视觉改动）、关联 Issue 编号以及风险与回滚计划。若 PR 修改了多语言或配置文件，请在描述中列出需要复核的语言/环境，方便评审者对照 `src/i18n/` 与 `src/config.ts` 校验。

## 配置与安全提示
生产站点设置集中在 `src/config.ts` 与环境变量（通过 `.env` 在 `astro.config.ts` 引入）；请勿在仓库中提交真实密钥，使用占位符并在 PR 中说明配置步骤。`@qwik.dev/partytown` 的补丁位于 `patches/`，更新依赖后务必确认补丁仍能应用，同时保持 `pnpm-lock.yaml` 一同提交，确保团队使用一致的依赖树。涉及第三方脚本时遵循 Content Security Policy，优先放置于 `public/` 或经过 Astro 处理的资产目录。
