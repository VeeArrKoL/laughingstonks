# laughingstonks API
Laughingstonks API is a KoLmafia script for predicting the seeded drops from the [Portable Laughing Stock](https://wiki.kingdomofloathing.com/Portable_Laughing_Stock). Drops are seeded based on path, class, and daycount for the first 4 days of an ascension.

## Installation
Install laughingstonks API into KoLmafia by using this command in the gCLI:
```
git checkout VeeArrKoL/laughingstonks api
```

## API
It is possible to call the underlying laughingstonks functions directly. Note that these will return no data if `daycount > 4`, as the drops are no longer seeded beyond that point.

Signatures:
```
item[int] laughing_stock_drops(int class_id, int path_id, int daycount, int max_fights);

item[int] laughing_stock_drops(class clazz, path the_path, int daycount, int max_fights);

// Uses current class, path, and daycount.
item[int] laughing_stock_drops(int max_fights);
```

Example:
```
import <laughingstonks.ash>;

item[int] laughing_stock_drops(my_class(), my_path(), my_daycount(), 500);
foreach fight_num, drop in results {
	print(`{fight_num} {drop.name}`);
}
```
