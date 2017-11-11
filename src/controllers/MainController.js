import dotenv from 'dotenv';
dotenv.config();

import Redux from '../models/ReduxWrapper';
import Line from '../utils/LineWrapper';
import commonHandler from './CommonController';
import handleIddleState from './IddleController';
import handleInGameState from './InGameController';
import { STATE_ID } from '../constants';

export const decideAction = event => {
  if (process.env.DEV_ENV) {
    console.log('-------- Retrieved Object From Line --------');
    console.dir(event);
    console.log('--------------------------------------------');
    console.log('============ Server Redux State ============');
    console.dir(Redux.getState());
    console.log('============================================');
  }
  
  commonHandler(event);
  
  const message_source = Line.getSourcetype(event);
  switch(message_source) {
    case 'group':
      return decideActionGroupOrRoom(event);
      break;
    case 'room':
      return decideActionGroupOrRoom(event);
      break;
    case 'user':
      return decideActionUser(event);
      break;
    default:
      console.log('1. The message source supposed to be from either group, room or user');
      return null;
      break;
  }
}

const decideActionGroupOrRoom = event => {
  const message_type = Line.getMessageType(event);
  switch(message_type) {
    case 'text':
      return decideActionGroupOrRoomTextMessage(event);
      break;
    default:
      console.log('2. Currently we ignore all message type other than text message');
      return null;
      break;
  }
}

const decideActionUser = event => {
  const message_type = Line.getMessageType(event);
  switch(message_type) {
    case 'text':
      return decideActionUserTextMessage(event);
      break;
    default:
      console.log('2. Currently we ignore all message type other than text message');
      return null;
      break;
  }
}

const decideActionGroupOrRoomTextMessage = event => {
  const sourceId = Line.getSourceId(event);
  const stateId = Redux.getStateId(sourceId);

  switch(stateId){
    case STATE_ID.IDDLE:
      return handleIddleState(event);
      break;
    case STATE_ID.IN_GAME:
      return handleInGameState(event);
      break;
    default:
      return null;
      break;
  }
}

const decideActionUserTextMessage = event => {
  const sourceId = Line.getSourceId(event);
  const stateId = Redux.getStateId(sourceId);

  switch(stateId){
    case STATE_ID.IDDLE:
      return handleIddleState(event);
      break;
    case STATE_ID.IN_GAME:
      return handleInGameState(event);
      break;
    default:
      return null;
      break;
  }
}

/**
 * Helper functions
 */

/**
 * Responsible to reply suitable message
 */

export const doAction = () => {
  const state = Redux.getState();
  if (process.env.DEV_ENV) {
    console.log('------ State changed : New Redux State ------');
    console.dir(state);
    console.log('---------------------------------------------');
  }
  return null;
}
