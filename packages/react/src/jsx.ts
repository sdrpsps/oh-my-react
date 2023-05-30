import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	ElementType,
	Key,
	Props,
	ReactElement,
	Ref,
	Type
} from 'shared/ReactTypes';

// React.createElement 方法定义
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'Sunny Chou'
	};
	return element;
};

// 生成 JSX 的方法
export const jsx = (type: ElementType, config: any, ...mayChildren: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	// 遍历所有 config ，详情参考 Babel 官网 JSX Demo
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		/**
		 *  {}.hasOwnProperty.call(a，b) 的作用就是以安全的方式检查一个对象是否拥有自身属性b
		 *  如果直接使用 config.hasOwnProperty() 可能导致可能会出现属性被继承的情况，导致出现错误结果
		 *  把除了 key 和 ref 之外的字段直接放进 props 里面
		 */
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	// children 有多种情况，可能只有一个也可能有多个
	const maybeChildrenLength = mayChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = mayChildren[0];
		} else {
			props.children = mayChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

// 开发环境下的 JSX 生成方法，暂时与生产环境方法一样
export const jsxDEV = jsx;
