import { Props, Key, Ref } from 'shared/ReactTypes';
import { workTag } from './workTag';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: workTag;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	pendingProps: Props;
	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: workTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null; // div p span ...
		this.ref = null;

		// 构成树状结构，用来表示节点之间的关系
		this.return = null; // 指向父 fiberNode
		this.sibling = null; // 指向兄弟 fiberNode
		this.child = null; // 指向子 fiberNode
		this.index = 0; // 同级的 fiberNode 标识

		// 作为工作单元
		this.pendingProps = pendingProps; // 这个工作单元刚开始工作的 props
		this.memoizedProps = null; // 这个工作单元完成工作后的 props
		this.alternate = null; // 用于双缓存树之间的切换
		this.flags = NoFlags; // 副作用标识
	}
}
