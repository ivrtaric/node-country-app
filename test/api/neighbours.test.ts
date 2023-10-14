import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';

import { runSqlFile, SERVER_URL } from 'test/util';
import { getClient } from 'src/db/connect';
import format from 'pg-format';
import { Neighbour } from 'src/types';

chai.use(chaiHttp);

describe('Neighbours', () => {
	before(async () => {
		await runSqlFile(path.join(__dirname, '..', '..', 'src', 'db', 'schema', '00-schema.sql'));
		await runSqlFile(path.join(__dirname, '..', 'fixtures', 'db-data-neighbours-api.sql'));
	});

	describe('POST /countries/:id/neighbours', () => {
		it('should add a set of new neighbours', async () => {
			const neighboursBefore = await getNeighbours(1);
			expect(neighboursBefore).to.be.an('array').of.length(2);
			[2, 7].forEach(neighbourId => expect(neighboursBefore).to.include(neighbourId));

			// prettier-ignore
			const res = await chai.request(SERVER_URL)
				.post('/countries/1/neighbours')
				.set('Content-Type', 'application/json')
				.send({ neighbour_ids: [2, 3, 4] });

			expect(res.status).to.equal(201);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				message: 'Neighbours added successfully: 3, 4'
			});

			const neighbours = await getNeighbours(1);
			expect(neighbours).to.be.an('array').of.length(4);
			[2, 7, 3, 4].forEach(neighbourId => expect(neighbours).to.include(neighbourId));
		});

		it('should return HTTP 404 if a target country is missing', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
				.post('/countries/20/neighbours')
				.set('Content-Type', 'application/json')
				.send({ neighbour_ids: [2, 3, 4] });

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"ids":[20]}']
			});
		});

		it('should return HTTP 404 if a target neighbour is missing', async () => {
			// prettier-ignore
			const res = await chai.request(SERVER_URL)
				.post('/countries/1/neighbours')
				.set('Content-Type', 'application/json')
				.send({ neighbour_ids: [2, 30, 400] });

			expect(res.status).to.equal(404);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equal({
				status: 404,
				message: ['Not found: Country {"ids":[30,400]}']
			});
		});

		it('should return HTTP 400 for invalid data', async () => {
			const res = await chai
				.request(SERVER_URL)
				.post('/countries/1/neighbours')
				.set('Content-Type', 'application/json')
				.send({ neighbour_ids: ['France', 'Germany', 'Spain'] });

			expect(res.status).to.equal(400);
			expect(res.body).to.deep.equal({
				status: 400,
				message: [
					'Invalid country ID: Expected a positive integer, got "string"',
					'Invalid country ID: Expected a positive integer, got "string"',
					'Invalid country ID: Expected a positive integer, got "string"'
				]
			});
		});

		describe('Incomplete data', async () => {
			// prettier-ignore
			[
				['{ neighbour_ids: [] }', { neighbour_ids: [] }, 'Neighbour IDS array must not be empty'],
				['{ neighbour_ids: null }', { neighbour_ids: null }, 'Invalid country ID: Expected a positive integer, got "null"'],
				['{ neighbour_ids: undefined }', { neighbour_ids: undefined }, 'Invalid country ID: Expected a positive integer, got "undefined"'],
				['{}', {}, 'Invalid country ID: Expected a positive integer, got "undefined"']
			].map(([testCase, incompletePayload, expectedMessage]) =>
				it(`should return HTTP 400 for ${testCase}`, async () => {
					const res = await chai.request(SERVER_URL)
						.post('/countries/1/neighbours')
						.set('Content-Type', 'application/json')
						.send(incompletePayload);

					expect(res.status).to.equal(400);
					expect(res.body).to.deep.equal({
						status: 400,
						message: [expectedMessage]
					});
				})
			);
		});
	});

	describe('DELETE /countries/:id/neighbours/:neighbourId', () => {
		it('should remove the neighbour relation', async () => {
			//
		});

		it('should return HTTP 404 if the target country does not exist', async () => {
			//
		});

		it('should return HTTP 404 if the target neighbour does not exist', async () => {
			//
		});
	});

	const getNeighbours = async (countryId: number): Promise<Array<number | bigint>> => {
		const client = await getClient();
		const results = await client.query<Neighbour>(
			format(`SELECT * FROM neighbours WHERE country_id = %1$L`, countryId)
		);

		return results.map(n => n.neighbour_id);
	};
});
