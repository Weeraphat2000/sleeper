import { ping } from 'tcp-ping';

describe('Health', () => {
  test('Reservations', async () => {
    const response = await fetch('http://reservations:3000');
    expect(response.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3001');
    expect(response.ok).toBeTruthy();
  });

  test('Payments', (done) => {
    ping(
      { address: 'payments', port: 3003 },
      (
        err,
        // data
      ) => {
        // console.log(data);
        if (err) {
          fail();
        }
        done();
      },
    );
  });

  test('Payments', (done) => {
    ping(
      { address: 'payments', port: 3004 },
      (
        err,
        //  data
      ) => {
        // console.log(data);
        if (err) {
          fail();
        }
        done();
      },
    );
  });
});
