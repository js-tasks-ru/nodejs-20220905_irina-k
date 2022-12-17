// Хранилище соединений.
let clients = [];

// Сохраняем текущие подключения.
exports.subscribe = function(resolve) {
  clients.push(resolve);
};

// Отправляем сообщения всем подписанным клиентам.
exports.publish = function(message) {
  clients.forEach(function(resolve) {
    resolve(message);
  });
  clients = [];
};
