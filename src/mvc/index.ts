import { Controller } from './controller';
import db from './db';
import { Module } from './module';
import { Serializer } from './serializer';
import { entrance, Service } from './service';

export default {
  Controller,
  Module,
  Serializer,
  Service,
  entrance,
  db,
  ...db,
};
