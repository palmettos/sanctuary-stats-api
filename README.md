<h3 align="center">
    <img src="https://raw.githubusercontent.com/palmettos/sanctuary-stats-api/master/docs/logo.png" />
</h3>
<h1 align="center">Sanctuary Stats API</h1>

Motivation
---

Diablo II: Lord of Destruction speedruns have received increasing viewership on Twitch in recent years due to their highly entertaining and dynamic nature. Much information about the state of a speedrun, however, is hidden in game menus that the viewer rarely has a chance to observe. By exposing this information to the viewer in real-time, we can dramatically improve the experience of spectating a speedrun. 

Previously, I built a Twitch extension called Diablo 2 Item Display. This extension only displays the runner's current equipped items. The Sanctuary Stats API is the basis for the functionality of the next iteration of the Twitch extension. My goal is to increase the amount of game state that's exposed to the viewer as well as build a system that's more robust, better documented and easier to extend. The data is recorded in a database at certain intervals and served by the API as time series. This allows changes in the data over time to be visualized in the extension's front-end. This makes it easier to estimate the quality of a run if the viewer missed the beginning of it, as well as enriching the viewer's experience overall.

Overview
---
The sequence of events involved in sending data from the broadcaster's system to the extension front-end is as follows:

![Sequence diagram of a data transaction](https://raw.githubusercontent.com/palmettos/sanctuary-stats-api/master/docs/sequence.png)
