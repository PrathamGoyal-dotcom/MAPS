const env = require('./config/env');
const { connectDB } = require('./config/db');
const app = require('./app');

const PORT = env.PORT;

// Initialize Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
