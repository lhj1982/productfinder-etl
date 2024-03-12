-- launch_bot_users.launch_productfinder_products definition
-- it's used for allow AWS glue to map table to mysql schema

CREATE TABLE `launch_productfinder_products` (
  `isdiscounted` tinyint(1) DEFAULT NULL,
  `searchtime` bigint DEFAULT NULL,
  `quantity` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `imageurl` text,
  `currentprice` bigint DEFAULT NULL,
  `merchgroup` varchar(100) DEFAULT NULL,
  `currency` varchar(100) DEFAULT NULL,
  `stylecolor` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `shihuoprice` bigint DEFAULT NULL,
  `shihuorepurchase` varchar(100) DEFAULT NULL,
  `shihuomonthpurchase` varchar(100) DEFAULT NULL,
  `shihuopurchasenumber` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `releasedate` varchar(100) DEFAULT NULL,
  `retailprice` int DEFAULT NULL,
  `stockxhighestprice` int DEFAULT NULL,
  `stockxlowestprice` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;