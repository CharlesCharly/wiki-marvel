const axios = require('axios');

test('Test Google.com', async () => {
  const response = await axios.get('https://www.google.com');
  expect(response.status).toBe(200);
});
