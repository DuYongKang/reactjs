1.首先，通过声明我们想要的确切数据，我们的API调用变得更容易理解 服务器。对于一个web应用程序代码库的新手来说，看到GraphQL查询可以立即实现它 显然，来自服务器的数据和来自客户机的数据是什么。

2.GraphQL也为更好的单元和集成测试打开了大门:在客户端模拟数据很容易， 可以断言，您的服务器GraphQL更改不会在客户机中破坏GraphQL查询 代码

3.GraphQL也在设计时考虑到性能，特别是对于移动客户端。 仅指定每个查询中所需的数据就可以防止过度获取(即:，服务器检索 并传输最终未被客户使用的数据。这减少了网络流量和帮助 提高对尺寸敏感的移动环境的速度。

4.传统的JSON api的开发经验通常是可以接受的(而且令人恼火) 更多)。大多数api都缺乏文档，或者更糟糕的是文档 与API的行为不一致。api可以改变，而不是立即明显的


GraphQL vs. REST
1.REST的一个缺点是“端点爬行”。假设你正在构建一个社交网络应用程序，然后开始 / user /:id /profile。首先，这个端点返回的数据对每个数据都是相同的 平台和应用的每个部分，但慢慢地你的产品会进化并积累更多的功能 在“profile”的保护伞下。这对于只需要的应用程序的新部分是有问题的 一些配置文件数据，例如新闻提要的工具提示。最后你可能会创建一些类似的东西 /:id/ profile_short，这是完整配置文件的一个限制版本。
2.当您遇到更多需要新的端点的情况时(想象一个profile_medium !)，您 现在，复制一些带有/ profile和/ profile_short(可能是浪费服务器)的数据 网络资源。这也使开发经验更加难以理解—— 开发人员发现每个变体中返回的数据是什么?你的文档是最新的吗?
3.建N个端点的另一种方法是向查询参数添加一些graphql风格的功能，例如/ user/:id/profile?include=user.name,user.id，但仍然缺少GraphQL的许多特性做这样的系统在长期工作。例如，这种API仍然没有强大的类型信息 支持弹性单元测试和长寿命代码。这对于移动应用程序来说尤其重要 古老的二进制文件可能在野外存在很长一段时间
4.最后，用于开发和调试REST api的工具通常是缺乏光泽的 在流行的api中几乎没有什么共同点。在最低水平上，你有非常普遍的 目的工具旋度和wget,一些api可能会支持大摇大摆¹⁰²或其他文档 格式，对于特定API的最高级别，如弹性搜索或Facebook的图形API 可能会发现定制工具。GraphQL的类型系统支持内省(换句话说，您可以) 使用GraphQL本身来发现关于GraphQL服务器的信息，它支持可插拔和 移动开发人员




还有一个安全问题——很容易把SQL从web应用中推入 基础数据库，这将不可避免地导致安全问题。稍后我们会看到， GraphQL还支持精确的访问控制逻辑，可以查看哪些类型的数据，以及哪些数据 通常更灵活，更不可能像使用原始SQL那样缺乏安全感

请记住，使用GraphQL并不意味着您必须放弃后端SQL数据库 - GraphQL服务器可以位于任何数据源之上，无论是SQL、MongoDB、Redis，甚至是a 第三方API。事实上，GraphQL的优点之一是可以编写单个GraphQL 可以同时进行多个数据存储(或其他api)的抽象。


Relay是Facebook的框架,示了用于连接反应GraphQL服务器组件。它允许您可以编写这样的代码，它显一个项目组件如何自动检索数据 来自hack的GraphQL服务器



(function() {
  var query = " { graphQLHub } ";
  var options = {
    method: "POST",
    body: query,
    headers: {
      "content-type": "application/graphql"
    }
  };

  window
    .fetch("https://graphqlhub.com/graphql", options)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
    });
})();


1.创建一个HTTP服务器
2.添加接受GraphQL请求的端点
3.构建我们的GraphQL模式
4.编写为我们模式中的每个GraphQL字段解析数据的glue -code
5.支持GraphiQL，以便我们能够快速地调试和迭代




npm install babel-register babel-preset-es2015 express --save --save-exact


fuck 命令行中不支持单引号