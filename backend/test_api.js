// Using built-in fetch

async function test() {
  const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser_final',
      email: 'final@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
