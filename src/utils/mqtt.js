/*
 * @Author: 刘小满
 * @Date: 2024-10-08 13:40:40
 * @Descripttion: 
 */
import store from "../store";
import mqtt from 'mqtt'
/**
 * MQTT实现发送消息
 * @param: topic: 主题
 * @param: message: 消息体
 * @author: liuhuan
 * @time: 2024-10-08 13:53:51
 **/
export default class MqttClient {
  constructor(options) {
    this.heartbeatTopic = options.heartbeatTopic; // 心跳主题
    this.heartbeatContent = options.heartbeatContent; // 心跳内容
    this._timer = null;  // 心跳控制器
    this._url = store.state.config.mqttOption.fullPath;
    this.options = Object.assign({}, store.state.config.mqttOption, options || {}) 
    this.client = null
    this.connected = false
    this.clientCount = 0
    this.connectSuccess = options.connectSuccess
    this.connectMessage = options.connectMessage
    this.connectError = options.connectError
    this.connectReconnect = options.connectReconnect
    this.connectClose = options.connectClose
    this.connect()
  }
  connect() {
    this.client = mqtt.connect(this._url, this.options)
    this.client.on('connect', () => {
      this.connected = true
      this.connectSuccess && this.connectSuccess()
    })
    this.client.on('message', (topic, payload, packet) => {
      const payloadStr = new TextDecoder('utf-8').decode(payload)
      const payloadObj = JSON.parse(payloadStr)
      this.connectMessage && this.connectMessage(topic, payloadObj)
    })
    this.client.on('error', (error) => {
      this.closeHeartbeat()
      this.connected = false;
      this.connectError && this.connectError(error)
    })
    this.client.on('reconnect', (error) => {
      console.log(`正在第${this.clientCount}重连`, error);
      this.connectReconnect && this.connectReconnect(error)
      this.clientCount++;
      if (this.clientCount >= 10) {
        this.close();
      }
    })
    this.client.on('close', (error) => {
      this.closeHeartbeat()
      this.connectClose && this.connectClose(error)
    })
  }
  publish(topic, message) {
    if (this.connected) {
      this.client.publish(topic, message)
    } else {
      console.log('mqtt publish error:', 'not connected')
    }
  }
  subscribe(topic) {
    if (this.connected) {
      this.client.subscribe(topic)
    } else {
      console.log('mqtt subscribe error:', 'not connected')
    }
  }
  unsubscribe(topic) {
    if (this.connected) {
      this.client.unsubscribe(topic)
    } else {
      console.log('mqtt unsubscribe error:', 'not connected')
    }
  }
  on(event, callback) {
    this.client.on(event, callback)
  }
  off(event, callback) {
    this.client.off(event, callback)
  }
  close() {
    this.client.end()
  }
  // 心跳
  heartbeat() {
    if(!this.heartbeatTopic) {
      console.log('mqtt heartbeat error:', 'heartbeatTopic is not set')
      return false
    }
    clearInterval(this._timer);
    this._timer = null;
   this._timer = setInterval(() => {
      this.publish(this.heartbeatTopic, this.heartbeatContent)
    }, 2000)
  }
  closeHeartbeat() {
    clearInterval(this._timer);
    this._timer = null;
  }
}