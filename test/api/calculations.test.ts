import 'app-module-path/cwd';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as path from 'path';

import { runSqlFile, SERVER_URL } from 'test/util';

chai.use(chaiHttp);

describe('Neighbours', () => {
	before(async () => {
		await runSqlFile(path.join(__dirname, '..', '..', 'src', 'db', 'schema', '00-schema.sql'));
		await runSqlFile(path.join(__dirname, '..', 'fixtures', 'db-data-neighbours-api.sql'));
	});

	describe('GET /calculate/optimal-route', () => {
		it('should calculate the optimal route for connected countries', async () => {
			const res = await chai
				.request(SERVER_URL)
				.get('/calculate/optimal-route?source_country_id=2&target_country_id=7');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equals({
				source_country_id: 2,
				target_country_id: 7,
				optimal_route: [2, 1, 7]
			});
		});

		it('should return the direct route for directly connected countries', async () => {
			const res = await chai
				.request(SERVER_URL)
				.get('/calculate/optimal-route?source_country_id=1&target_country_id=2');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equals({
				source_country_id: 1,
				target_country_id: 2,
				optimal_route: [1, 2]
			});
		});

		it('should return empty array for non-connected countries', async () => {
			const res = await chai
				.request(SERVER_URL)
				.get('/calculate/optimal-route?source_country_id=1&target_country_id=4');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equals({
				source_country_id: 1,
				target_country_id: 4,
				optimal_route: []
			});
		});
	});
});
