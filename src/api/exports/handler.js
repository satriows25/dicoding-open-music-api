class ExportsHandler {
  constructor(
    playlistsService,
    playlistSongsService,
    producerService,
    validator
  ) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._producerService = producerService;
    this._validator = validator;
  }

  async postExportPlaylistByIdHandler(request, h) {
    this._validator.validateExportNotesPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      userId: credentialId,
      targetEmail: request.payload.targetEmail
    };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
