import { Props, Key, Ref } from 'shared/ReactTypes';
import { workTag } from './workTag';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

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
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;

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
		this.memoizedState = null;
		this.updateQueue = null;
		this.alternate = null; // 用于双缓存树之间的切换
		this.flags = NoFlags; // 副作用标识
	}
}

export class FiberRootNode {
	container: Container; // 对于 react-dom 环境来说，Container 就是 DOM Element
	current: FiberNode; // 指向 hostRootFiber
	finishedWork: FiberNode | null; // 指向整个更新完成后的 hostRootFiber
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;

		// 双缓存树的切换
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;

	return wip;
};
