describe('Reservations', () => {
  beforeAll(async () => {
    const user = {
      email: 'sleeper@gmail.com',
      password: 'P@ssw0rd',
    };

    await fetch('http://auth:3001', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  });

  test('Create', async () => {});
});
