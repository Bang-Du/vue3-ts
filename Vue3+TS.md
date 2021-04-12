[TOC]





# Vue3 基础  



## setup

- 创建组件实例，然后初始化 props ，紧接着就调用setup 函数。从生命周期钩子的视角来看，它会在 `beforeCreate` 钩子之前被调用
- 会返回一个对象，对象的属性会被合并到组件模板的渲染上下文
- 参数
  - props，作为第一个参数，这是一个响应式对象，可以通过`watch`观察 `props` 的更新，==但是==，不要解构props对象，不然会失去响应性，
  - context，作为第二个参数，暴露出attrs，slots，emit；
- this 参数：在setup中不可用，





### 响应式系统API

#### reactive  

> 接受一个普通对象然后返回响应式代理，建议仅使用代理对象而避免依赖原始对象



#### ref

> 接收一个参数值并返回一个响应式且可改变的ref对象，拥有一个指向内部的单一属性 `.value`

```JS
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```



- 在模板中访问时，可直接使用，无需内模板内额外书写 .value，它会自动解套

- 作为响应式对象的属性访问，当ref作为reactive对象的property被访问或修改时，也将自动解套value值，其行为类似普通属性

  ```js
  const count = ref(0)
  const state = reactive({
    count,
  })
  console.log(state.count) // 0
  state.count = 1
  console.log(count.value) // 1
  
  /* 注意如果将一个新的 ref 分配给现有的 ref， 将替换旧的 ref： */
  
  const otherCount = ref(2)
  
  state.count = otherCount
  console.log(state.count) // 2
  console.log(count.value) // 1
  ```

  

#### computed

> 传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)
console.log(plusOne.value) // 2
plusOne.value++ // 错误！
```

或者传入一个拥有 `get` 和 `set` 函数的对象，创建一个可手动修改的计算状态。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  },
})
plusOne.value = 1
console.log(count.value) // 0
```



#### readonly

> 传入一个对象或 ref，返回一个原始对象的只读代理，对象内部任何嵌套属性都是只读的



#### watchEffect

>  立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。在setup或者生命周期钩子函数被调用时，会在组件卸载时自动停止。也可以手动停止，watchEffect函数会返回一个值，调用后可停止监听

```js
const count = ref(0)

const stop = watchEffect(() => console.log(count.value))
// -> 打印出 0

setTimeout(() => {
  count.value++
  // -> 打印出 1
}, 100)

stop(); // 停止监听
```



```js
// 同步运行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'sync',
  }
)

// 组件更新前执行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'pre',
  }
)
```



**侦听器调试**

`onTrack` 和 `onTrigger` 选项可用于调试一个侦听器的行为。

- 当一个 reactive 对象属性或一个 ref 作为依赖被追踪时，将调用 `onTrack`
- 依赖项变更导致副作用被触发时，将调用 `onTrigger`

这两个回调都将接收到一个包含有关所依赖项信息的调试器事件。建议在以下回调中编写 `debugger` 语句来检查依赖关系：

```js
watchEffect(
  () => {
    /* 副作用的内容 */
  },
  {
    onTrigger(e) {
      debugger
    },
  }
)
```





#### watch

- **侦听单个数据源**

  侦听器的数据源可以是一个拥有返回值的 getter 函数，也可以是 ref：

  ```js
  // 侦听一个 getter
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  
  // 直接侦听一个 ref
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

- **侦听多个数据源**

  `watcher` 也可以使用数组来同时侦听多个源：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```



## 生命周期钩子函数

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'
// beforeCreate,created 函数在 vue3中不再有
const MyComponent = {
	// 只能在 setup() 期间同步使用
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  },
}
```





## 响应式系统工具集

### unref

> 如果参数是一个 ref 则返回它的 `value`，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖。



### toRef

>  `toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当您要将一个 prop 中的属性作为 ref 传给组合逻辑函数时，`toRef` 就派上了用场：

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  },
}
```





### toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型如下:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 对象 与 原属性的引用是 "链接" 上的
state.foo++
console.log(stateAsRefs.foo) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当想要从一个组合逻辑函数中返回响应式对象时，用 `toRefs` 是很有效的，该 API 让消费组件可以 解构 / 扩展（使用 `...` 操作符）返回的对象，并不会丢失响应性：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })

  // 对 state 的逻辑操作

  // 返回时将属性都转为 ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以解构，不会丢失响应性
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
    }
  },
}
```



### 判断类型的API

- isRef：检查是否为一个 ref 对象
- isProxy：检查一个对象是否是由 reactive 或 readonly 方法创建的代理
- isReactive：检查一个对象是否是由 reactive 创建的响应式代理
- isReadonly：检查一个对象是否是由 readonly 创建的只读代理





## 高级响应式系统 API

### customRef

`customRef` 用于自定义一个 `ref`，可以显式地控制依赖追踪和触发响应，接受一个工厂函数，两个参数分别是用于追踪的 `track` 与用于触发响应的 `trigger`，并返回一个一个带有 `get` 和 `set` 属性的对象

使用自定义 ref 实现带防抖功能的 `v-model` 

```html
<input v-model="text" />
```

```js
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

export default {
  setup() {
    return {
      text: useDebouncedRef('hello'),
    }
  },
}
```



### markRaw

> 显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身。





### shallowReactive

只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
})

// 变更 state 的自有属性是响应式的
state.foo++
// ...但不会深层代理
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```



### shallowReadonly

只为某个对象的自有（第一层）属性创建浅层的**只读**响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2,
  },
})

// 变更 state 的自有属性会失败
state.foo++
// ...但是嵌套的对象是可以变更的
isReadonly(state.nested) // false
state.nested.bar++ // 嵌套属性依然可修改
```



### shallowRef

创建一个 ref ，将会追踪它的 `.value` 更改操作，但是并不会对变更后的 `.value` 做响应式代理转换（即变更不会调用 `reactive`）

```js
const foo = shallowRef({})
// 更改对操作会触发响应
foo.value = {}
// 但上面新赋的这个对象并不会变为响应式对象
isReactive(foo.value) // false
```





# Vue3 + TS

## store

```ts
import { createStore, createLogger } from 'vuex'
import { store as app, AppStore, AppState } from '@/store/modules/app'
import { store as settings, SettingStore, SettingsState } from '@/store/modules/settings'

export interface RootState {
    app: AppState,
    settings: SettingsState
}

export type Store = AppStore<Pick<RootState, 'app'>> & 
  									SettingStore<Pick<RootState, 'settings'>>

const debug = process.env.NODE_ENV !== 'production'
const plugins = debug ? [createLogger({})] : []

export const store = createStore({
  plugins,
  modules: {
    app,
    settings,
  }
})

export function useStore(): Store {
  return store as Store
}

```



目录结构：modules 下有各级module，里面包含state、mutation、action等，接下来使用 modules/app 作为演示讲解

### state.ts

```typescript
import { getSidebarStatus, getSize } from '@/utils/cookies'
import { getLocale } from '@/locales'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface AppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
}

export const state: AppState = {
  device: DeviceType.Desktop,
  sidebar: {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  },
  language: getLocale(),
  size: getSize() || 'medium'
}

```



### mutations.ts

```typescript
import { MutationTree } from 'vuex'
import { AppState, DeviceType } from './state'
import { setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'

// 定义mutation的名称
export enum AppMutationTypes {
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
  TOGGLE_DEVICE = 'TOGGLE_DEVICE',
  SET_LANGUAGE = 'SET_LANGUAGE',
  SET_SIZE = 'SET_SIZE',
}

export type Mutations<S = AppState> = {
  [AppMutationTypes.TOGGLE_SIDEBAR](state: S, withoutAnimation: boolean): void
  [AppMutationTypes.CLOSE_SIDEBAR](state: S, withoutAnimation: boolean): void
  [AppMutationTypes.TOGGLE_DEVICE](state: S, device: DeviceType): void
  [AppMutationTypes.SET_LANGUAGE](state: S, language: string): void
  [AppMutationTypes.SET_SIZE](state: S, size: string): void

}

export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationTypes.TOGGLE_SIDEBAR](state: AppState, withoutAnimation: boolean) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = withoutAnimation
    if (state.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  },

  [AppMutationTypes.CLOSE_SIDEBAR](state: AppState, withoutAnimation: boolean) {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  },

  [AppMutationTypes.TOGGLE_DEVICE](state: AppState, device: DeviceType) {
    state.device = device
  },

  [AppMutationTypes.SET_LANGUAGE](state: AppState, language: string) {
    state.language = language
    setLanguage(state.language)
  },

  [AppMutationTypes.SET_SIZE](state: AppState, size: string) {
    state.size = size
    setSize(state.size)
  }

}

```



### actions.ts

```typescript
import { ActionTree, ActionContext } from 'vuex'

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store'
import { AppState, DeviceType } from './state'
import { Mutations } from './mutations'
import { AppMutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<AppState, RootState>, 'commit'>

export enum AppActionTypes {
  ACTION_TOGGLE_SIDEBAR = 'ACTION_TOGGLE_SIDEBAR',
  ACTION_CLOSE_SIDEBAR = 'ACTION_CLOSE_SIDEBAR',
  ACTION_TOGGLE_DEVICE = 'ACTION_TOGGLE_DEVICE',
  ACTION_SET_LANGUAGE = 'ACTION_SET_LANGUAGE',
  ACTION_SET_SIZE = 'ACTION_SET_SIZE',
}
  
export interface Actions {
  [AppActionTypes.ACTION_TOGGLE_SIDEBAR](
    { commit }: AugmentedActionContext,
    withoutAnimation: boolean
  ): void
  [AppActionTypes.ACTION_CLOSE_SIDEBAR](
    { commit }: AugmentedActionContext,
    withoutAnimation: boolean
  ): void
  [AppActionTypes.ACTION_TOGGLE_DEVICE](
    { commit }: AugmentedActionContext,
    device: DeviceType
  ): void
  [AppActionTypes.ACTION_SET_LANGUAGE](
    { commit }: AugmentedActionContext,
    language: string
  ): void
  [AppActionTypes.ACTION_SET_SIZE](
    { commit }: AugmentedActionContext,
    size: string
  ): void
}

export const actions: ActionTree<AppState, RootState> & Actions = {
  [AppActionTypes.ACTION_TOGGLE_SIDEBAR]({ commit }, withoutAnimation: boolean) {
    commit(AppMutationTypes.TOGGLE_SIDEBAR, withoutAnimation)
  },
  [AppActionTypes.ACTION_CLOSE_SIDEBAR]({ commit }, withoutAnimation: boolean) {
    commit(AppMutationTypes.CLOSE_SIDEBAR, withoutAnimation)
  },
  [AppActionTypes.ACTION_TOGGLE_DEVICE]({ commit }, device: DeviceType) {
    commit(AppMutationTypes.TOGGLE_DEVICE, device)
  },
  [AppActionTypes.ACTION_SET_LANGUAGE]({ commit }, language: string) {
    commit(AppMutationTypes.SET_LANGUAGE, language)
  },
  [AppActionTypes.ACTION_SET_SIZE]({ commit }, size: string) {
    commit(AppMutationTypes.SET_SIZE, size)
  }
}

```



### app.ts

```typescript
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'
import { getLocale } from '@/locales'
import { store } from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface AppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements AppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public language = getLocale()
  public size = getSize() || 'medium'

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }
}

export const AppModule = getModule(App)

```



### index.ts

```typescript
import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  Module
} from 'vuex'

// TODO: How to surpass cyclical dependency linting errors cleanly?
import { RootState } from '@/store'
import { state } from './state'
import { mutations, Mutations } from './mutations'
import { actions, Actions } from './actions'
import type { AppState } from './state'

export { AppState }

export type AppStore<S = AppState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
& {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
};
export const store: Module<AppState, RootState> = {
  state,
  mutations,
  actions
}

```









**使用方法**

```ts
import { useStore } from '@/store'

const store = useStore()

// 获取值
const size = computed(() => {
  return store.state.app.size
});
const state = reactive({
  theme: store.state.settings.theme
});


// 使用 mutation，action

useStore().commit(TagsMutationTypes.ACTION_DEL_ALL_CACHED_VIEWS, undefined)
useStore().dispatch(TagsActionTypes.ACTION_DEL_ALL_CACHED_VIEWS, undefined)
useStore().dispatch(AppActionTypes.ACTION_SET_SIZE, size)
```







## 注意事项

### 类型断言

1. 在获取元素DOM时

   ```typescript
   document.getElementById(props.id) as HTMLDivElement
   
   // HTML[元素的标签名，首字母大写]Element
   ```



2. 在给元素添加事件时

   ```typescript
   sidebarElm.value.addEventListener('transitionend', sidebarResizeHandler as EventListener)
   ```

   

3. 在给echarts的图标setOption时

   ```typescript
   import { init, EChartsOption } from 'echarts'
   
   const barChart = init(document.getElementById(props.id) as HTMLDivElement)
   barChart.setOption({...} as EChartsOption)
   ```



4. 组件的 props

   ```typescript
   import { defineComponent, PropType } from 'vue'
   
   export default defineComponent({
     props: {
        list1: {
           type: [] as PropType<Array<ArticleModel>>,
           default: () => {
             return []
           }
         },
     }
   })
   ```

   

5. DOM事件

```typescript
const handleInput = (event: KeyboardEvent) => {
      const value = (event.target as HTMLInputElement).value
      contex.emit('inputVal', value)
      if (ctx.$parent.$options.name === 'ElFormItem') {
        if (props.validateEvent) {
          contex.emit('el.form.change', [value])
        }
      }
    }
```





### el-form

> 表单 el-form 的 model 和 ref 的值不能相同，否则会失去响应式数据































