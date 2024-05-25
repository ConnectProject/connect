import { APP_PORT } from './config/index.js';
import connectServer from './connectServer.js';

connectServer.start(APP_PORT);
