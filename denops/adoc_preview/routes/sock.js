const socket = new WebSocket('ws://localhost:8080/ws');

socket.onmessage = (m) => {
  console.log(m);
}
socket.onerror = function (m) {
  console.log("Error at socket.io ");
  console.log(m);
}
socket.addEventListener('message', function (event) {
  let res = JSON.parse(event.data);
  console.log("got message");
  console.log(res);
  window.scroll({
    top: 1000 ,
    behaviro: 'smooth'
  }
  );
})
