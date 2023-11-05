import 'app-module-path/cwd';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as path from 'path';
import format from 'pg-format';

import { getClient } from 'src/db/raw';
import { NotFoundError } from 'src/errors';
import { runSqlFile, SERVER_URL } from 'test/util';

chai.use(chaiHttp);

describe('Countries', () => {
	before(async () => {
		await runSqlFile(path.join(__dirname, '..', '..', 'src', 'db', 'schema', '00-schema.sql'));
		await runSqlFile(path.join(__dirname, '..', 'fixtures', 'db-data-country-api.sql'));
	});

	describe('GET /countries', () => {
		it('should GET all the countries', async () => {
			const res = await chai.request(SERVER_URL).get('/countries');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body).to.have.length(2);

			const [first, second] = res.body;

			expect(first).to.deep.equal({
				id: 1,
				name: 'United States',
				code: 'USA',
				code_alpha_2: 'US',
				code_alpha_3: 'USA',
				flag: 'us_flag.png'
			});
			expect(second).to.deep.equal({
				id: 2,
				name: 'Canada',
				code: 'CAN',
				code_alpha_2: 'CA',
				code_alpha_3: 'CAN',
				flag: 'canada_flag.png'
			});
		});
	});

	describe('GET /countries/:id', () => {
		it('should reference country by a number ID', async () => {
			const res = await chai.request(SERVER_URL).get('/countries/usa');

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				message: ['Invalid country ID: Expected a positive integer, got "usa"'],
				status: 400
			});
		});

		it('should GET a single country', async () => {
			const res = await chai.request(SERVER_URL).get('/countries/1');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');

			expect(res.body).to.deep.equal({
				id: 1,
				name: 'United States',
				code: 'USA',
				code_alpha_2: 'US',
				code_alpha_3: 'USA',
				flag: 'us_flag.png'
			});
		});

		it('should return HTTP 404 for non-existent country', async () => {
			const res = await chai.request(SERVER_URL).get('/countries/20');

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"id":20}']
			});
		});
	});

	describe('POST /countries', () => {
		const validData = {
			name: 'France',
			code: 'FRA',
			code_alpha_2: 'FR',
			code_alpha_3: 'FRA',
			flag: 'france_flag.png'
		};

		it('should create a new country', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.post('/countries')
			.set('Content-Type', 'application/json')
			.send(validData);

			expect(res.status).to.equal(201);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				id: 3,
				...validData
			});

			const newCountry = await getCountry(3);
			expect(newCountry).to.be.an('object');
			expect(newCountry).to.deep.equal({
				id: 3,
				...validData
			});
		});

		it('should return HTTP 400 for invalid data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.post('/countries')
			.set('Content-Type', 'application/json')
			.send({
				...validData,
				code: 12345, // Invalid data type
				code_alpha_2: true // Invalid data type
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: [
					'Invalid country data: code - Expected string, received number: 12345',
					'Invalid country data: code_alpha_2 - Expected string, received boolean: true'
				]
			});
		});

		it('should return HTTP 400 for incomplete data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.post('/countries')
			.set('Content-Type', 'application/json')
			.send({
				name: 'France'
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: [
					'Invalid country data: Missing required property: code',
					'Invalid country data: Missing required property: code_alpha_2',
					'Invalid country data: Missing required property: code_alpha_3'
				]
			});
		});
	});

	describe('PUT /countries/:id', () => {
		const validData = {
			name: 'New France',
			code: 'NFR',
			code_alpha_2: 'NF',
			code_alpha_3: 'NFR',
			flag: 'new_france_flag.png'
		};

		it('should reference country by a number ID', async () => {
			const res = await chai
				.request(SERVER_URL)
				.put('/countries/usa')
				.set('Content-Type', 'application/json')
				.send(validData);

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				message: ['Invalid country ID: Expected a positive integer, got "usa"'],
				status: 400
			});
		});

		it('should update an existing country', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.put('/countries/3')
			.set('Content-Type', 'application/json')
			.send(validData);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				id: 3,
				...validData
			});

			const newCountry = await getCountry(3);
			expect(newCountry).to.be.an('object');
			expect(newCountry).to.deep.equal({
				id: 3,
				...validData
			});
		});

		it('should return HTTP 400 for invalid data', async () => {
			const res = await chai
				.request(SERVER_URL)
				.put('/countries/3')
				.set('Content-Type', 'application/json')
				.send({
					...validData,
					code: 12345, // Invalid data type
					code_alpha_2: true // Invalid data type
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: [
					'Invalid country data: code - Expected string, received number: 12345',
					'Invalid country data: code_alpha_2 - Expected string, received boolean: true'
				]
			});
		});

		it('should return HTTP 400 for incomplete data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.put('/countries/3')
			.set('Content-Type', 'application/json')
			.send({
				name: 'New New France'
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: [
					'Invalid country data: Missing required property: code',
					'Invalid country data: Missing required property: code_alpha_2',
					'Invalid country data: Missing required property: code_alpha_3'
				]
			});
		});

		it('should return HTTP 404 for non-existent country data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.put('/countries/20')
			.set('Content-Type', 'application/json')
			.send(validData);

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"id":20}']
			});
		});
	});

	describe('PATCH /countries/:id', () => {
		const validData = {
			name: 'New France',
			code: 'NFR',
			code_alpha_2: 'NF',
			code_alpha_3: 'NFR',
			flag: 'new_france_flag.png'
		};

		it('should reference country by a number ID', async () => {
			const res = await chai
				.request(SERVER_URL)
				.put('/countries/usa')
				.set('Content-Type', 'application/json')
				.send(validData);

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: ['Invalid country ID: Expected a positive integer, got "usa"']
			});
		});

		it('should update an existing country', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.patch('/countries/3')
			.set('Content-Type', 'application/json')
			.send(validData);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				id: 3,
				...validData
			});

			const newCountry = await getCountry(3);
			expect(newCountry).to.be.an('object');
			expect(newCountry).to.deep.equal({
				id: 3,
				...validData
			});
		});

		it('should return HTTP 404 for non-existent country data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.patch('/countries/20')
			.set('Content-Type', 'application/json')
			.send(validData);

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"id":20}']
			});
		});

		it('should return HTTP 400 for invalid data', async () => {
			const res = await chai
				.request(SERVER_URL)
				.patch('/countries/3')
				.set('Content-Type', 'application/json')
				.send({
					...validData,
					code: 12345, // Invalid data type
					code_alpha_2: true // Invalid data type
				});

			expect(res.status).to.equal(400);
		});

		it('should update target record with incomplete data', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
			.patch('/countries/3')
			.set('Content-Type', 'application/json')
			.send({
				name: 'New New France'
			});

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				id: 3,
				...validData,
				name: 'New New France'
			});

			const newCountry = await getCountry(3);
			expect(newCountry).to.be.an('object');
			expect(newCountry).to.deep.equal({
				id: 3,
				...validData,
				name: 'New New France'
			});
		});
	});

	describe('DELETE /countries/:id', () => {
		it('should reference country by a number ID', async () => {
			const res = await chai.request(SERVER_URL).delete('/countries/usa');

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: ['Invalid country ID: Expected a positive integer, got "usa"']
			});
		});

		it('should DELETE a single country', async () => {
			const res = await chai.request(SERVER_URL).delete('/countries/3');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				message: 'Country with ID 3 has been deleted successfully.'
			});
		});

		it('should return HTTP 404 for non-existent country', async () => {
			const res = await chai.request(SERVER_URL).delete('/countries/20');

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"id":20}']
			});
		});
	});

	const getCountry = async (id: number) => {
		const client = await getClient();
		const results = await client.query(format(`SELECT * FROM country WHERE id = %1$L`, id));
		if (!results?.length) {
			throw new NotFoundError('Country', { id });
		}

		return results[0];
	};
});
