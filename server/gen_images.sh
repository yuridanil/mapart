#!/bin/bash

# truncate table mapart.images;
# insert into mapart.images(title, `desc`, lat, lng, zoom, bearing, user_id, filters, likes, shown, width, height, category, tags) select * from (WITH RECURSIVE cte (n) as (SELECT 1 UNION ALL SELECT n + 1 FROM cte WHERE n < 100) select 'test', '', 0 lat , 0 lng, 0 zoom, 0 bearing, 1, '' user_id, 0 likes, 1 shown, 1652, 929, null category, null tags FROM cte) a;
# select * from mapart.images i ;

for i in in {1..10}
do
  cp server/template.jpg build/uploads/$i.jpg
  cp server/template.jpg build/uploads/thumbs/$i.jpg
done