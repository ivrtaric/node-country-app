import 'app-module-path/cwd';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import * as path from 'path';

import { start } from 'src/app';
import env from 'src/env';
import { gracefulShutdown } from 'src/util/server';

import { runSqlFile } from 'test/util';

chai.use(chaiHttp);

let server: Server;

const serverUrl = `http://localhost:${env.PORT}${env.BASE_PATH}`;

before(async () => {
	await runSqlFile(path.join(__dirname, '..', '..', 'src', 'db', 'schema', '00-schema.sql'));
	await runSqlFile(path.join(__dirname, '..', 'fixtures', 'db-data.sql'));

	const appValues = start();
	server = appValues.server;
});

after(async () => {
	await gracefulShutdown(server);
});

describe('GET /countries', () => {
	it('it should GET all the countries', async () => {
		const res = await chai.request(serverUrl).get('/countries');

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
	it('it should GET a single country', async () => {
		const res = await chai.request(serverUrl).get('/countries/1');

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

	it('it should return 404 for non-existant country', async () => {
		const res = await chai.request(serverUrl).get('/countries/20');

		expect(res.status).to.equal(404);
		expect(res.body).to.be.an('object');
		expect(res.body).to.deep.equal({
			status: 404,
			message: 'Not found: Country {"id":20}'
		});
	});
});

describe('POST /countries', () => {
	it('it should create a new country', async () => {
		// const res = await chai.request(serverUrl).post('/countries');
		//
		// expect(res.status).to.equal(200);
		// expect(res.body).to.be.an('object');
		//
		// expect(res.body).to.deep.equal({
		// 	id: 1,
		// 	name: 'United States',
		// 	code: 'USA',
		// 	code_alpha_2: 'US',
		// 	code_alpha_3: 'USA',
		// 	flag: 'us_flag.png'
		// });
	});
});

describe('PUT /countries/:id', () => {
	//
});

describe('PATCH /countries/:id', () => {
	//
});

describe('DELETE /countries/:id', () => {
	//
});
