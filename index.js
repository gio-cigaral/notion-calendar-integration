import 'dotenv/config';
import SyncController from './controllers/SyncController.js';

// dotenv.config();

// TODO: move all initialisation and authentication logic to relevant controller
// TODO: initialise environment (dotenv) then call main controller (SyncController)

const syncController = new SyncController();
syncController.sync();