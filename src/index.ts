import 'app-module-path/cwd';
import express from 'express';
import * as dotenv from 'dotenv';

import { router } from 'src/routes';

dotenv.config();

const { PORT = 3000, BASE_PATH = '/' } = process.env;

const app = express();

app.use(BASE_PATH, router);
app.listen(PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
