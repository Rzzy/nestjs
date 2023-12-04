import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { merge } from 'lodash';

const YAML_CONFIG_FILENAME = 'config.yml';
const filePath = join(__dirname, '../config', YAML_CONFIG_FILENAME);
const envPath = join(
  __dirname,
  '../config',
  `config.${process.env.NODE_ENV || 'devalopment'}.yml`,
);
const commonConfig = yaml.load(readFileSync(filePath, 'utf8'));
const envConfig = yaml.load(readFileSync(envPath, 'utf8'));

// 因为ConfigModule模块，有一个load方法接受的是函数， 所以到处一个函数
export default () => {
  console.log(commonConfig, 'commonConfig');
  return merge(commonConfig, envConfig);
};
