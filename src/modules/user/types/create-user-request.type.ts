import { Request } from 'express';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { RequestBody, RequestParams } from '../../../shared/libs/rest/types/index.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
