1 .工作把应用程序分成组件
2。构建一个静态版本的应用程序
3。决定什么应该是有状态的
4。确定每个国家应该生活在哪个组件上
5。硬编码初始状态
6。添加反向数据流
7 .添加服务器通信



确定是否使用state
1.它是通过道具传递给父母的吗?如果是这样，它可能不是state
2.它会随时间改变吗?如果不是，它可能不是状态
3.你能基于其他的状态或组件的道具来计算它吗?如果是这样,它不是state


•识别所有基于该状态的组件。
•找到一个共同的所有者组件(高于所有组件的单个组件)这需要层次结构中的状态。
•在层次结构中，公共所有者或其他组件都应该在更高的层次中出现state.
•如果你找不到一个能让你拥有state的东西，那就创造一个新的组件仅用于持有state并将其添加到层次结构中的某个位置高于公共所有者件。