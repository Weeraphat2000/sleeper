describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'sleeper@gmail.com',
      password: 'P@ssw0rd',
    };

    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    jwt = await response.text();
    console.log('jwt', jwt);
  });

  test('Create & Get', async () => {
    const createdReservation = await createReservation();

    const responseGet = await fetch(
      `http://reservations:3000/reservations/${createdReservation._id}`,
      {
        headers: {
          Authentication: jwt,
        },
      },
    );

    const reservation = await responseGet.json();
    console.log('reservationreservationreservation', reservation);
    console.log(
      'createdReservationcreatedReservationcreatedReservation',
      createdReservation,
    );

    expect([createdReservation]).toEqual(reservation);
  });

  const createReservation = async () => {
    const response = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
      body: JSON.stringify({
        startDate: '12/1/2544',
        endDate: '10/1/2544',
        charge: {
          amount: 999999,
          card: {
            number: '5555555555554444',
            exp_month: 12,
            exp_year: 2028,
            cvc: '123',
          },
        },
      }),
    });

    return response.json();
  };
});
