import connectServer from './connectServer.js';
import { APP_PORT } from './config/index.js';

await connectServer.start(APP_PORT).catch((e) => console.log(e));
