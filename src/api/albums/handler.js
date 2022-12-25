const config = require('../../utils/config');

class AlbumsHandler {
  constructor(
    albumsService,
    songsService,
    storageService,
    albumsValidator,
    uploadsValidator
  ) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._albumsValidator = albumsValidator;
    this._uploadsValidator = uploadsValidator;
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);

    const albumId = await this._albumsService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    album.songs = await this._songsService.getSongByAlbumId(id);

    return {
      status: 'success',
      data: {
        album
      }
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    };
  }

  async postUploadCoverAlbumByIdHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

    const { name, year } = await this._albumsService.getAlbumById(id);
    await this._albumsService.editAlbumById(id, { name, year, coverUrl });

    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil ditambahkan'
    });

    response.code(201);
    return response;
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    const albumUserLike = await this._albumsService.getAlbumLikeByUserId(
      credentialId,
      albumId
    );

    if (Number(albumUserLike) > 0) {
      await this._albumsService.deleteAlbumLikeById(credentialId, albumId);
    } else {
      await this._albumsService.postAlbumLikeById(credentialId, albumId);
    }

    const response = h.response({
      status: 'success',
      message: 'Status album berhasil diperbarui'
    });

    response.code(201);
    return response;
  }

  async getAlbumLikeByIdHandler(request, h) {
    const { id } = request.params;

    const { likeCount, isCache } =
      await this._albumsService.getAlbumLikeCountById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: Number(likeCount)
      }
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;
