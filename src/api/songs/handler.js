class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);

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
    let songs = await this._service.getSongs(request.query);

    const { title, performer } = request.query;

    if (title) {
      songs = songs.filter((song) =>
        song.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (performer) {
      songs = songs.filter((song) =>
        song.performer.toLowerCase().includes(performer.toLowerCase())
      );
    }

    return {
      status: 'success',
      data: {
        songs
      }
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song
      }
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }
}

module.exports = SongsHandler;
