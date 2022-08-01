module.exports = async () =>
  DB.User.find({})
    .remove()
    .then(() =>
      DB.User.create(
        {
          provider: 'local',
          name: 'Test User',
          email: 'test@bobprep.com',
          password: 'bobprep.com',
          emailVerified: true
        },
        {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: process.env.ADMIN_EMAIL || 'admin@bobprep.com',
          password: process.env.APP_NAME || 'bobprep.com',
          isZoomAccount: true,
          emailVerified: true
        }
      )
    );
