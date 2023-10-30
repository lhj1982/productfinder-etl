#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import config from '../config';
import { ProductFinderETLStack } from '../lib/productfinder-etl-stack';

const app = new cdk.App();
// role stack
new ProductFinderETLStack(app, `launch-productfinder-etl-stack`, config);