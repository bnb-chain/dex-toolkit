function noop() {}
const CLOST_SOCKET = 1e3;
const SOCKET_CODE = 1005;

export default function WS(this: any, url: string, opts: any) {
  opts = opts || {};

  const ms = opts.timeout || 3000;

  const $: any = {};
  const self = this;

  let k: any;
  let ws: any;
  let timer: any;

  $.onmessage = opts.onmessage || noop;

  $.onclose = (e: any) => {
    e.code !== CLOST_SOCKET &&
      e.code !== SOCKET_CODE &&
      !ws.__closeRequested__ &&
      !timer &&
      self.reconnect(e);
    (opts.onclose || noop)(e);
  };

  $.onerror = (e: any) => {
    (opts.onerror || noop)(e);
    if (e.code !== CLOST_SOCKET && e.code !== SOCKET_CODE && !ws.__closeRequested__ && !timer) {
      self.reconnect(e);
    }
  };

  $.onopen = (e: any) => {
    timer = null;
    (opts.onopen || noop)(e);
  };

  self.open = () => {
    ws = new WebSocket(url, opts.protocols);
    for (k in $) ws[k] = $[k]; // eslint-disable-line
  };

  self.reconnect = (e: any) => {
    console.log('reconnect starting websocket');
    timer = setTimeout(() => {
      timer = null;
      console.log('reconnect starting websocket timer cleaned');
      (opts.onreconnect || noop)(e);
      self.open();
    }, ms);
  };

  self.json = (x: any) => {
    ws.send(JSON.stringify(x));
  };

  self.send = (x: any) => {
    ws.send(x);
  };

  self.close = (x: any, y: any) => {
    ws.__closeRequested__ = true;
    ws.close(x, y);
    console.log(` websocket close manul ${url}`);
  };

  self.open(); // init

  return self;
}
