import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame
from pyspark.sql import functions as SqlFuncs

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Script generated for node Amazon Glue Data Catalog
AmazonGlueDataCatalog_node1697612316095 = glueContext.create_dynamic_frame.from_catalog(
    database="launch-productfinder-etl-glue-database",
    table_name="launch_productfinder_products",
    transformation_ctx="AmazonGlueDataCatalog_node1697612316095",
)

# Script generated for node Change Schema
ChangeSchema_node1697612327197 = ApplyMapping.apply(
    frame=AmazonGlueDataCatalog_node1697612316095,
    mappings=[
        ("isdiscounted", "boolean", "isdiscounted", "long"),
        ("searchtime", "long", "searchtime", "string"),
        ("quantity", "string", "quantity", "long"),
        ("imageurl", "string", "imageurl", "string"),
        ("currentprice", "long", "currentprice", "string"),
        ("merchgroup", "string", "merchgroup", "boolean"),
        ("currency", "string", "currency", "string"),
        ("stylecolor", "string", "stylecolor", "string"),
        ("status", "string", "status", "string"),
        ("shihuoprice", "long", "shihuoprice", "string"),
        ("shihuorepurchase", "string", "shihuorepurchase", "long"),
        ("shihuomonthpurchase", "string", "shihuomonthpurchase", "string"),
        ("shihuopurchasenumber", "string", "shihuopurchasenumber", "string"),
    ],
    transformation_ctx="ChangeSchema_node1697612327197",
)

# Script generated for node Drop Duplicates
DropDuplicates_node1697991423867 = DynamicFrame.fromDF(
    ChangeSchema_node1697612327197.toDF().dropDuplicates(),
    glueContext,
    "DropDuplicates_node1697991423867",
)

# Script generated for node Amazon Glue Data Catalog
AmazonGlueDataCatalog_node1697991438605 = glueContext.write_dynamic_frame.from_catalog(
    frame=DropDuplicates_node1697991423867,
    database="launch-productfinder-etl-glue-database",
    table_name="launch_bot_users_launch_productfinder_products",
    transformation_ctx="AmazonGlueDataCatalog_node1697991438605",
)

job.commit()
