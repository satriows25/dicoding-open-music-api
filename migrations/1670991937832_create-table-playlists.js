exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
