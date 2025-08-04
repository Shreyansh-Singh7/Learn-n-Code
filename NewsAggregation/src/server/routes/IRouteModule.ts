import { Router } from 'express';

export interface IRouteModule {
    getRouter(): Router;
}
