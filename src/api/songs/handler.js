class SongsHandler {
  constructor(songsService, songsValidator) {
    this._songsService = songsService;
    this._songsValidator = songsValidator;
  }

  async postSongHandler(request, h) {
    this._songsValidator.validateSongPayload(request.payload);

    const songId = await this._songsService.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId
      }
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songs = await this._songsService.getSongs(request.query);

    return {
      status: 'success',
      data: {
        songs
      }
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._songsService.getSongById(id);

    return {
      status: 'success',
      data: {
        song
      }
    };
  }

  async putSongByIdHandler(request) {
    this._songsValidator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._songsService.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._songsService.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }
}

module.exports = SongsHandler;
