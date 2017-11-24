const   socket = io(),
        update = function (id, response) {
            if (response.action === 'insert') {
                app[response.collection].push(response.data);
            } else if (response.action === 'delete') {
                for (let property in app[response.collection]) {
                    if (app[response.collection][property][id] == response.data) {
                        delete app[response.collection][property];
                        break;
                    }
                }
            } else {
                _.assign(_.find(app[response.collection], [id, response.data[id]]), response.data);
            }
        },
        updateWithId = update.bind(null, ['id']),
        updateWithName = update.bind(null, ['name']);

socket.on('games', updateWithId);
socket.on('matches', updateWithId);
socket.on('players', updateWithName);
socket.on('rounds', updateWithId);
socket.on('tournament', function (response) {
    _.assign(app['tournament'], response.data);
});
socket.on('database', function (response) {
    _.assign(app, response);
});
