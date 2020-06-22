import { AxiosInstance, AxiosRequestConfig } from './types'
import { extend } from './helps/util'
import Axios from './core/Axios'
import defaults from './defaults'

function createInstance(initConfig: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(initConfig)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
