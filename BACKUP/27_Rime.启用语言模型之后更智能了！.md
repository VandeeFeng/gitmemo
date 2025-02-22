# [Rime 启用语言模型之后更智能了！](https://github.com/VandeeFeng/gitmemo/issues/27)

今天重构了 GitHub webhook 来同步更新到 gitmemo 的数据库，还是没能解决已有 issue 插入新 row 的问题，增量更新的功能是正常的。

解决了，原来是保存的时候 owner 没有统一大小写。。。  --2024-12-23

现在同步更方便了，GitHub issue 有变化的时候会触发 webhook 自动写入数据库，手动同步支持增量更新，不用每次都重复写入所有的 issue

## Rime 启用语言模型

各个国家有各个国家的国歌可以直接打出来了！我是用的雾凇拼音的小鹤双拼， 加上了万象语言模型之后，上下文的联想功能明显增强了，牛逼啊。Rime 就是最好的输入法没有之一。

[为rime的输入方案启用语言模型 - 闲聊灌水 - Emacs China](https://emacs-china.org/t/rime/28508)

[Fcitx 最佳配置实践 (附带语言大模型) 2024-12-17](https://manateelazycat.github.io/2024/12/17/fcitx-best-config/)

[amzxyz/RIME-LMDG: Rime输入法语言模型全流程构建教程，全局带声调词库，最全带读音单字表词典](https://github.com/amzxyz/RIME-LMDG)

## Emacs 新玩意
有一段时间没逛 Emacs China 了，又发现很多好玩意。Gemini 现在这么强，没有大佬考虑重写一下 Emacs 里的 AI 补全么。

[将你的 org-roam-ui 发布到 GitHub page 上 - Org-mode - Emacs China](https://emacs-china.org/t/org-roam-ui-github-page/28511)，这个也很实用。

[终端版的 childframe 要来了 - Emacs-general - Emacs China](https://emacs-china.org/t/childframe/28166)

[（发布）Org-supertag v0.01 发布，增强 org-mode 的标签系统 - Org-mode - Emacs China](https://emacs-china.org/t/org-supertag-v0-01-org-mode/28530)

[（新坑）打算在 emacs 上复刻 Tana 的 SuperTag - Emacs-general - Emacs China](https://emacs-china.org/t/emacs-tana-supertag/28407/9)，正巧最近也看到了 Tana 里的 SuperTag，这个思路可以借鉴。
