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
	updateCountry
} from 'src/api/routes/countries';
import { calculateOptimalRoute } from 'src/api/routes/calculations';

export const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router
	.get('/', (req, res) => res.send('Echo'))
	.get('/countries', getCountries)
	.get('/countries/:id', getCountryById)
	.post('/countries', createCountry)
	.put('/countries/:id', updateCountry)
	.patch('/countries/:id', updateCountry)
	.delete('/countries/:id', deleteCountry)
	.post('/countries/:id/neighbours', addNeighbours)
	.delete('/countries/:id/neighbours/:neighbourId', removeNeighbour)
	.get('/calculate/optimal-route', calculateOptimalRoute);
