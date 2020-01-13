#!/bin/bash

mongod --shutdown --dbpath=db/db-1/data
mongod --shutdown --dbpath=db/db-2/data
mongod --shutdown --dbpath=db/db-3/data
mongod --shutdown --dbpath=db/db-4/data
