References:

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_glue.CfnDatabase.html

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html

https://github.com/aws-samples/aws-cdk-examples

# Deployment step

* Make sure launch-productfinder-infra stack is deployed
* Upload ddb-to-mysql.py to `s3://aws-glue-assets-734176943427-cn-northwest-1/scripts/ddb-to-mysql.py` 
* Make sure tables in schema.sql is in place
* Make sure dynamodb and mysql glue crawler is deployed and running succussfully
* run `npm run deploy:cntest/cnprod`
* run 2 crawlers manually to detect tables
* manually update 2 parameters for job (Type: Spark, Language: Python 3)


## Update product_prices table
We created a series of new tables to present product catalog info, product price is a part of it.
We need to convert the ETL result into the target table to be able to show them in UI

```sql
TRUNCATE table product_catalog.product_prices ; 

insert into product_catalog.product_prices (product_id, price, retailprice, lastsaleprice, stockxlowestprice, stockxhighestprice, check_date) 
select (select distinct id from product_catalog.products p where p.stylecolor =lpp.stylecolor ) as product_id , 
lpp.shihuoprice as price , lpp.retailprice, lpp.lastsaleprice, lpp.stockxlowestprice, lpp.stockxhighestprice,   
from_unixtime(lpp.searchtime div 1000 ,'%Y-%m-%d %h:%i:%s') as check_date 
from launch_bot_users.launch_productfinder_products lpp 
where (select 1 from product_catalog.products p2 where p2.stylecolor =lpp.stylecolor ) 
group by lpp.shihuoprice, lpp.lastsaleprice, lpp.retailprice, lpp.stockxlowestprice, lpp.stockxhighestprice, lpp.searchtime , lpp.stylecolor;
```

Update product release date

```sql
UPDATE product_catalog.products p 
SET p.release_date = (SELECT STR_TO_DATE(max(lpp.releasedate), '%Y-%m-%d') FROM launch_bot_users.launch_productfinder_products lpp 
WHERE lpp.stylecolor = p.stylecolor GROUP BY lpp.stylecolor)
AND p.release_date IS NULL;
```