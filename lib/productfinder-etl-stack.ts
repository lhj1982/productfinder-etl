// import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, aws_glue as glue } from 'aws-cdk-lib';
import { Construct } from 'constructs';

declare const parameters: any;
const databaseName = 'launch-productfinder-etl-glue-database';

export class ProductFinderETLStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        config: { account: string; region: string; oktaAdminRole: string; oscarApiArn: string },
        props?: StackProps,
    ) {
        super(scope, id, props);

        const cfnDatabase = new glue.CfnDatabase(this, 'launch-productfinder-etl-glue-database', {
            catalogId: config.account,
            databaseInput: {
                description: 'description',
                name: databaseName,
                parameters: {}
            },
        });

        const ddbCrawler = new glue.CfnCrawler(this, 'launch-productfinder-etl-glue-ddb-crawler', {
            role: `arn:aws-cn:iam::${config.account}:role/launch-productfinder-etl-role`,
            targets: {
                dynamoDbTargets: [{
                    path: 'launch-productfinder-products'
                }]

            },
            databaseName,
            description: 'description',
            name: 'launch-productfinder-etl-ddb-crawler',
        });

        const rdsCrawler = new glue.CfnCrawler(this, 'launch-productfinder-etl-glue-rds-crawler', {
            role: `arn:aws-cn:iam::${config.account}:role/launch-productfinder-etl-role`,
            targets: {
                jdbcTargets: [{
                    connectionName: 'launch-productfinder-etl',
                    path: 'launch_bot_users/%',
                }]

            },
            databaseName,
            description: 'description',
            name: 'launch-productfinder-etl-rds-crawler',
        });

        const cfnJob = new glue.CfnJob(this, 'launch-productfinder-etl-ddb-to-mysql', {
            command: {
                name: 'ddb-to-mysql',
                pythonVersion: '3',
                scriptLocation: 's3://aws-glue-assets-734176943427-cn-northwest-1/scripts/ddb-to-mysql.py',
            },
            role: `arn:aws-cn:iam::${config.account}:role/launch-productfinder-etl-role`,
            connections: {
                connections: ['launch-productfinder-etl'],
            },
            defaultArguments: {
                '--job-language': 'python'
            },
            glueVersion: '3.0',
            logUri: 's3://aws-glue-assets-734176943427-cn-northwest-1/sparkHistoryLogs/',
            maxRetries: 0,
            name: 'launch-productfinder-etl-ddb-to-mysql',

            numberOfWorkers: 2,

            timeout: 2880,
            workerType: 'G.1X',
        });

        // workflow
        const cfnWorkflow = new glue.CfnWorkflow(this, 'launch-productfinder-etl-workflow', /* all optional props */ {
            defaultRunProperties: {},
            description: 'orchestration for productfinder ETL flow',
            name: 'launch-productfinder-etl-workflow'
        });

        const cfnTrigger = new glue.CfnTrigger(this, 'launch-productfinder-etl-trigger', {
            actions: [{
                arguments: {},
                jobName: cfnJob.name,
                // securityConfiguration: 'securityConfiguration',
                timeout: 600,
            }],
            type: 'SCHEDULED',

            // the properties below are optional
            description: 'Job for product finder ETL process',
            name: 'launch-productfinder-etl-trigger',
            schedule: 'cron(01 17 * * ? *)',
            startOnCreation: true,
            workflowName: cfnWorkflow.name,
        });

        cfnTrigger.addDependency(cfnWorkflow)
    }
}