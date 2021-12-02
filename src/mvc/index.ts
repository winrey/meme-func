import { Controller } from './controller';
import db from './db';
import { Module } from './module';
import { Serializer } from './serializer';
import { entrance, Service } from './service';

export * from './common';
export * from './controller';
export * from './db';
export * from './module';
export * from './register';
export * from './serializer';
export * from './service';

export * as controller from './controller';
export * as db from './db';
export * as modules from './module';
export * as register from './register';
export * as serializers from './serializer';
export * as service from './service';

export default {
  Controller,
  Module,
  Serializer,
  Service,
  entrance,
  db,
  ...db,
};
