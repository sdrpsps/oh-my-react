import { Action } from 'shared/ReactTypes';

// 代表更新的数据结构
export interface Update<State> {
	action: Action<State>;
}

// 消费 Update 的数据结构
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 返回一个 Update 的实例，视频写法
/*export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};*/

// 返回一个 Update 的实例，我习惯的写法
export function createUpdate<State>(action: Action<State>): Update<State> {
	return {
		action
	};
}

// 创建消费 Update 的实例，视频写法
/*export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};*/

// 创建消费 Update 的实例，我习惯的写法
export function createUpdateQueue<Action>(): UpdateQueue<Action> {
	return {
		shared: {
			pending: null
		}
	};
}

// 将 Update 插入到 UpdateQueue，视频写法
/*export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};*/

// 将 Update 插入到 UpdateQueue，我习惯的写法
export function enqueueUpdate<Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) {
	updateQueue.shared.pending = update;
}

// 消费 UpdateQueue 的 Update，视频写法
/*export const progressUpdateQueue = <State>(
	baseState: State,
	pendingState: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof progressUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingState !== null) {
		const action = pendingState.action;
		if (action instanceof Function) {
			// 如果 baseState = 1, update (x) => 4x, memoizedState = 4x
			result.memoizedState = action(baseState);
		} else {
			// 如果 baseState = 1, update 2, memoizedState = 2
			result.memoizedState = action;
		}
	}

	return result;
};*/

// 消费 UpdateQueue 的 Update，我习惯的写法
export function progressUpdateQueue<State>(
	baseState: State,
	pendingState: Update<State> | null
): { memoizedState: State } {
	const result: ReturnType<typeof progressUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingState !== null) {
		const action = pendingState.action;
		if (action instanceof Function) {
			// 如果 baseState = 1, update (x) => 4x, memoizedState = 4x
			result.memoizedState = action(baseState);
		} else {
			// 如果 baseState = 1, update 2, memoizedState = 2
			result.memoizedState = action;
		}
	}
	return result;
}
