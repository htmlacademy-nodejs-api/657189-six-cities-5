import { Request } from 'express';
import { RequestBody, RequestParams } from '../../rest/types/index.js';
import { LoginUserDto } from './dto/user-login.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
