import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import {
	addNeighbours,
	createCountry,
	deleteCountry,
	getCountries,
	getCountryById,
	removeNeighbour,
	updateCountryComplete,
	updateCountryPartial
} from 'src/api/routes/countries';
import { calculateOptimalRoute } from 'src/api/routes/calculations';
import { handleErrorsWrapper as errSafe } from 'src/api/middleware/error-handler';

export const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router
	.get('/', (req, res) => res.send('Echo'))
	.get('/countries', errSafe(getCountries))
	.get('/countries/:id', errSafe(getCountryById))
	.post('/countries', errSafe(createCountry))
	.put('/countries/:id', errSafe(updateCountryComplete))
	.patch('/countries/:id', errSafe(updateCountryPartial))
	.delete('/countries/:id', errSafe(deleteCountry))
	.post('/countries/:id/neighbours', errSafe(addNeighbours))
	.delete('/countries/:id/neighbours/:neighbourId', errSafe(removeNeighbour))
	.get('/calculate/optimal-route', errSafe(calculateOptimalRoute));
