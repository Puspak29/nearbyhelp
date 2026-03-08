const app = require('./src/app');
const { PORT } = require('./src/config/env');
const connectDB = require('./src/config/db');

connectDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});