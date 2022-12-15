const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    { playlistsService, playlistsSongsService, songsService, validator }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      playlistsSongsService,
      songsService,
      validator
    );
    server.route(routes(playlistsHandler));
  }
};
