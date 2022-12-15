exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'VARCHAR(2000)',
      notNull: true
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
