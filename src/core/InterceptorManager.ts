import { ResolvedFn, RejectFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  reject?: RejectFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, reject?: RejectFn): number {
    this.interceptors.push({
      resolved,
      reject
    })
    return this.interceptors.length - 1
  }
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
