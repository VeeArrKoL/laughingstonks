# laughingstonks
Laughingstonks is a KoLmafia relay script for predicting the seeded drops from the [Portable Laughing Stock](https://wiki.kingdomofloathing.com/Portable_Laughing_Stock).

## Installation
Install laughingstonks into KoLmafia by using this command in the gCLI:
```
git checkout VeeArrKoL/laughingstonks
```

## Usage
Open the relay script, select the class, path, and days that you want to search. (It will start out using your current class, path, and daycount.) After clicking search, a table will be displayed for each day, listing the expected fruit drops that will occur after a certain number of successful combats with the Portable Laughing Stock equipped.

## Configuration
Laughingstonks supports the following configuration properties:

| Property | Default | Description |
| --- | --- | --- |
| `laughingstonks_maxDaysDisplayed` | `3` | The maximum number of days to display in a search. Wider screens can support larger values. |
| `laughingstonks_maxFights` | `500` | The maximum number of fights on each day to display data for. (Only applies to the relay script, not API calls.) |

## API
It is possible to call the underlying laughingstonks functions directly.

Signatures:
```
item[int] laughing_stock_drops(int class_id, int path_id, int daycount, int max_fights);

item[int] laughing_stock_drops(class clazz, path the_path, int daycount, int max_fights);
```

Example:
```
import <laughingstonks.ash>;

item[int] laughing_stock_drops(my_class(), my_path(), my_daycount(), 500);
foreach fight_num, drop in results {
	print(`{fight_num} {drop.name}`);
}
```

## Questions
* Why does the interface look so bad?
  * Because I'm not a front-end developer, and this is simple and gets the job done.
* "laughingstonks" is a stupid name.
  * no u
