References:

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_glue.CfnDatabase.html

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html

https://github.com/aws-samples/aws-cdk-examples

# Deployment step

* Make sure launch-productfinder-infra stack is deployed
* Upload ddb-to-mysql.py to `s3://aws-glue-assets-734176943427-cn-northwest-1/scripts/ddb-to-mysql.py` 
* run `npm run deploy:cntest/cnprod`
* run 2 crawlers manually to detect tables
* manually update 2 parameters for job (Type: Spark, Language: Python 3)
