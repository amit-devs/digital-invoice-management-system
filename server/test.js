async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('Login successful! Token:', data.token.substring(0, 20) + '...');
      console.log('User Details:', data.user);
    } else {
      console.error('Login failed:', data);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

test();
