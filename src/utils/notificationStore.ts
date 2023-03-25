import { createStore } from "./mapStore";

const messageMap = new Map<string, Message>();

const {
  valuesArr: notifications,
  pushValue: pushNewMessage,
  removeValue: removeMessage,
} = createStore(messageMap);
export { notifications, pushNewMessage, removeMessage };
