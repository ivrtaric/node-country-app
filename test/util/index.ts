import * as childProcess from 'child_process';

export const execute = (script: string) =>
	new Promise((resolve, reject) => {
		const child = childProcess.exec(script);
		if (child.stdout) child.stdout.pipe(process.stdout);
		if (child.stderr) child.stderr.pipe(process.stderr);
		child.on('exit', resolve);
		child.on('error', reject);
	});

export const runSqlFile = (filePath: string) => {
	const { CONTAINER_NAME, DB_NAME } = process.env;
	const containerName = `${CONTAINER_NAME}-test-db`;
	process.stderr.write(`runSqlFile: ${filePath} / ${containerName} / ${DB_NAME}\n `);
	return execute(`cat "${filePath}" | docker exec -i ${containerName} psql -U postgres -d ${DB_NAME}`);
};
