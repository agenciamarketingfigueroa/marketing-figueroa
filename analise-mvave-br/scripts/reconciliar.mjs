// Same validated entry point: revisions and first imports use one ledger implementation.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const result=spawnSync(process.execPath,[fileURLToPath(new URL('./importar.mjs',import.meta.url)),...process.argv.slice(2)],{stdio:'inherit'});
process.exitCode=result.status??1;
