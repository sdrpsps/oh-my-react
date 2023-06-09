import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTag';

// 指向当前工作中的 fiberNode 的全局指针
let workInProgress: FiberNode | null = null;

// 初始化当前 fiberNode 指针
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}

/*
 * 常见的触发更新的方式：
 * ReactDOM.createRoot().render（或老版的ReactDOM.render）
 * this.setState
 * useState的dispatch方法
 * */

// 在触发更新时调用
function renderRoot(root: FiberRootNode) {
	// 初始化，让我们当前的 workInProgress 指向我们需要第一个遍历的 fiberNode
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop 发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

/*
 * 以DFS（深度优先遍历）的顺序遍历ReactElement，这意味着：
 * 如果有子节点，遍历子节点
 * 如果没有子节点，遍历兄弟节点
 * 这是个递归的过程，存在递、归两个阶段：
 * 递：对应beginWork
 * 归：对应completeWork
 * */

function performUnitOfWork(fiber: FiberNode) {
	// next 可能是这个 fiberNode 的子 fiber 也可能是 null
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 如果没有子节点，就遍历兄弟节点
		completeUnitOfWork(fiber);
	} else {
		// 如果有子节点，就遍历子节点
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	const node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}

		workInProgress = node.return;
	} while (node !== null);
}
