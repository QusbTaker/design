/*
 * @Author: 刘小满
 * @Date: 2024-10-22 13:50:22
 * @Descripttion: 
 */
import { getConfigKey } from "@/api/system/config";
const state = { 
  mapKey: '4c8866fafae0b88f870f514064d986e4',
  securityJsCode: '9f269622442ca8bdb7a20a778c018c83',
  mqttOption: {
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    keepalive: 60,
    // username: "admin",
    // password: "admin123456",
    head: "ws", // 必须是 ws 或 wss （mqtt:// 或 mqtts:// 必须让后端开放websocket服务）
    host: "192.168.2.16", // ip地址
    port: 8083, // 服务端口
    tailPath: "mqtt", // 服务路径
    fullPath: 'ws://192.168.2.16:8083/mqtt'
  },
  liveUrl: '', // 直播推流地址
  pushLiveUrl: '', // 云台直播推送地址
}

const mutations = { 
  SET_CONFIG_KEY: (state, { key, value }) => {
    state[key] = value
  },
}

const actions = { 
  getInitConfig({ state , commit }) {
        // 获取初始参数配置
    getConfigKey('mqtt.base.url').then((response) => {
      commit('SET_CONFIG_KEY', { key: 'mqttOption', value: Object.assign(state.mqttOption, {
        fullPath: response.msg,
      })})
    });
    getConfigKey('live.url').then((response) => {
      commit('SET_CONFIG_KEY', { key: 'liveUrl', value: response.msg })
    });
    getConfigKey('push.live.url').then((response) => {
      commit('SET_CONFIG_KEY', { key: 'pushLiveUrl', value: response.msg })
    });
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
