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
				.get('/calculate/optimal-route?source_country_id=4&target_country_id=6');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.deep.equals({
				response: 24
			});
		});
	});
});
