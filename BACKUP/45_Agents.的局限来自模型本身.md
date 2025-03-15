# [Agents 的局限来自模型本身](https://github.com/VandeeFeng/gitmemo/issues/45)

MCP 无疑扩展了 LLM 的交互，后面可能还会出现其他的 protocols。

而 agents 的效果取决于 LLM 本身的能力。就从现在的 function calling 和 tool 的情况来说，距离我想象中的 agents 还有一段距离。
 
当 LLM 有了能够根据输入生成 tool 的能力的时候，才是 agents 真正爆发的时候。

去年12月，Anthropic提出了一个全新的定义：「LLM智能体能动态地决定自己的执行流程和工具使用方式，并自主控制任务的完成过程。」

直觉上，我觉得现有的 function calling 和 tool 的底层逻辑，是不太 agent 的。就类比人类的思维模式，它应该是更逻辑层面的实现，而不是结构上的实现。这句话说的不专业，意思就是这个意思。

我们现在实现的类 agent 概念和应用，实际上实现的是基于 LLM 进行的 workflows 的编排，而不是 LLM 自主的逻辑行为。当然，可以训练一个专门编排 function calling 的模型来当作 agents 的指挥模型，但还是觉得本末倒置。

我既不想鼓吹 AI，也对 AI 抱有很多幻想，未来起源于想象。

有点像魔术，虽然你知道它是假的，但重要的是它带给你难忘的体验。

虽然现在的 AI 其实还并不是那么的神奇，但是它已经像魔术一样实现了许多以前无法实现的东西。
