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
| `laughingstonks_maxFights` | `500` | The maximum number of fights on each day to display data for. |

## Questions
* Why does the interface look so bad?
  * Because I'm not a front-end developer, and this is simple and gets the job done.
* "laughingstonks" is a stupid name.
  * no u
