// 递归中的递阶段
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTag';
import { progressUpdateQueue, UpdateQueue } from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';

export const beginWork = (wip: FiberNode) => {
	// 比较，返回的是子 fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// HostText 没有子节点，直接 return null
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork为实现的类型');
			}
			break;
	}
};

/*
 * HostRoot 的 beginWork 工作流程
 * 计算状态的最新值
 * 创造子 fiberNode
 * */
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = progressUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/*
 * HostComponent 的 beginWork 工作流程
 * 创造子 fiberNode
 * */
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update 阶段
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount 阶段
		wip.child = mountChildFibers(wip, null, children);
	}
}
