import 'app-module-path/cwd';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as path from 'path';

import { runSqlFile, SERVER_URL } from 'test/util';

chai.use(chaiHttp);

describe('Neighbours', () => {
	before(async () => {
		await runSqlFile(path.join(__dirname, '..', 'fixtures', 'create-db-init.sql'));
	});

	describe('GET /calculate/optimal-route', () => {
		describe('Optimal routes', () => {
			it('between Portugal and Finland', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=170&target_country_id=71');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 170,
					target_country_id: 71,
					optimal_route: [170, 197, 72, 79, 169, 175, 71]
				});
			});

			it('between Albania and Algeria', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=1&target_country_id=2');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 1,
					target_country_id: 2,
					optimal_route: [1, 82, 216, 205, 103, 62, 120, 2]
				});
			});

			it('between Albania and Andorra', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=1&target_country_id=4');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 1,
					target_country_id: 4,
					optimal_route: [1, 186, 96, 191, 104, 72, 4]
				});
			});
		});

		describe('Directly connected countries', () => {
			it('between Albania and Montenegro', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=1&target_country_id=141');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 1,
					target_country_id: 141,
					optimal_route: [1, 141]
				});
			});
		});

		describe('Disconnected countries', () => {
			it('between American Samoa and United States', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=3&target_country_id=224');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 3,
					target_country_id: 224,
					optimal_route: []
				});
			});

			it('between Australia and Japan', async () => {
				const res = await chai
					.request(SERVER_URL)
					.get('/calculate/optimal-route?source_country_id=12&target_country_id=106');

				expect(res.status).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.deep.equals({
					source_country_id: 12,
					target_country_id: 106,
					optimal_route: []
				});
			});
		});
	});
});
