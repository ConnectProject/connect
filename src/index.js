import connectServer from './connectServer.js';
import { APP_PORT } from './config/index.js';

connectServer.start(APP_PORT);
