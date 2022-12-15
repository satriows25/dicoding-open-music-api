class PlaylistsHandler {
  constructor(
    playlistsService,
    playlistsSongsService,
    songsService,
    validator
  ) {
    this._playlistsService = playlistsService;
    this._playlistsSongsService = playlistsSongsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId
      }
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler() {
    const playlists = await this._playlistsService.getPlaylists();

    return {
      status: 'success',
      data: {
        playlists
      }
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._songsService.getSongById(songId);

    await this._playlistsSongsService.addSongToPlaylistId({
      playlistId,
      songId
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist'
    });

    response.code(201);
    return response;
  }

  async getSongsFromPlaylistIdHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    playlist.songs = await this._playlistsSongsService.getSongsFromPlaylistId(
      playlistId
    );

    return {
      status: 'success',
      data: {
        playlist
      }
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    };
  }

  async deleteSongFromPlaylistIdHandler(request) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistsSongsService.deleteSongFromPlaylistId(
      playlistId,
      songId
    );

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    };
  }
}

module.exports = PlaylistsHandler;
