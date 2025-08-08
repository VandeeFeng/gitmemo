# [Vibe Coding Timeline](https://github.com/VandeeFeng/gitmemo/issues/62)

随手记录一下 vibe coding 的发展，按照时间先后顺序排序。

# pair programming 阶段
## 以 Cursor 为代表的 AI 代码编辑器的出现
如果我没记错，cursor 在 vibe coding 概念被 AK 大佬提出之前就很多人在用了。

AK 大佬的几个 tweet 推广了一下 cursor。之后 cursor 就彻底火了，那个时候 cursor 的 Tab 和 vibe coding 的体验就是独一档。

## vibe coding 概念的提出
[Andrej Karpathy on X: "There's a new kind of coding I call "vibe coding"](https://x.com/karpathy/status/1886192184808149383)

## 各种 AI 工作流
Dify，n8n，字节的 Coze 扣子等。

## 更多基于 VSCode 的 AI 代码编辑器的出现
Cursor，Windsurf（已被 OpenAI 收购），Trae（字节）。还有 cline 这些 VSCode 的 AI 代码编辑插件。

还有 [Augment Code - AI coding platform for real software.](https://www.augmentcode.com/) ，[TabbyML/tabby: Self-hosted AI coding assistant](https://github.com/TabbyML/tabby) 等 IDE 插件。

## Claude code 等 CLI AI 代码编辑助手
卷完了 IDE，又开始下一轮了。Claude code 这是把 cursor 给背刺了。Cursor 最近也出现了一连串的反应: https://x.com/karminski3/status/1935423134892704219 , https://forum.cursor.com/t/cursor-pro-cursor-ultra/104528/11

OpenAI 也在 Claude code 出现之后的几个月开源了 codex：https://github.com/openai/codex

效果上，网上普遍的反馈 Claude code 比 codex 要好。

在 Claude code 等出现之前，Aider 这些 CLI 的代码编辑工具就已经很多了。

在官网短暂无法访问之后，2025-06-25 ，Gemini CLI 也来了：https://github.com/google-gemini/gemini-cli  , https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/

cursor 算是开始走下神坛了，负面的消息越来越多，吹的人越来越少，风向越来越导向 Claude code ，对国内的 IP 也开始控制了。

Amazon 推出了 [Kiro](https://kiro.dev/blog/introducing-kiro/)，又一个类 cursor。

陆续出现了 opencode：https://github.com/sst/opencode ,  crush: https://github.com/charmbracelet/crush

cursor 推出了 cursor CLI ：https://x.com/cursor_ai/status/1953559384531050724  , https://cursor.com/en/cli   --2025-08-07

# parallel agents 阶段
随着 Claude code 的兴起，parallel agents 的概念出现。各种 GitHub actions，自动代码审核提交 PR 的流程越来越成熟，看到很多项目都开始用 Claude code 做管理了。 --2025-07-19

有代表性的是这个项目：https://github.com/BloopAI/vibe-kanban
