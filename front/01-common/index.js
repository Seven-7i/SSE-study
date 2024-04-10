const btn_start = document.getElementById("btn_start");
const btn_stop = document.getElementById("btn_stop");

//生成li元素
function createLi(data) {
  let li = document.createElement("li");
  li.innerHTML = String(data.message);
  document.getElementById("list").appendChild(li)
}

let source = ''


btn_start.addEventListener("click", function () {
  //判断当前浏览器是否支持SSE
  if (!window.EventSource) {
    alert("当前浏览器不支持SSE")
    throw new Error("当前浏览器不支持SSE")
  }
  source = new EventSource('http://localhost:8088/sse/');
  source.onopen = onConnectOpen;
  source.onmessage = onConnectMessage;
  source.onerror = onConnectError;
});

btn_stop.addEventListener("click", function () {
  if (source) source.close();
  console.log("长连接关闭");
  fetch('http://localhost:8088/sse/close', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => {
    console.log(res)
  })
});


// //对于建立链接的监听
function onConnectOpen(event, a, b) {
  console.log(source);
  console.log("长连接打开", event, a, b);
};

//对服务端消息的监听
function onConnectMessage(event, a, b) {
  console.log(JSON.parse(event.data));
  console.log("收到长连接信息", event, a, b);
  createLi(JSON.parse(event.data));
};

//对断开链接的监听
function onConnectError(event, a, b) {
  console.log(source, source.readyState);
  console.log("长连接中断", event, a, b);
};
