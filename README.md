# Tanks
Tanks is a multiplayer HTML5 browser game. This is a project I have worked on periodically with different iterations since 2018. It is currently far from being complete. The game is written in JavaScript both on the front-end and back-end. The game draws a lot of inspiration from [a game for the Nintendo Wii][tanks]. Eventually I plan to host this game on my website when it is in a more finished state.

## Structure
`/client`: An [Express.js][express] app which hosts the client-side in-browser files.

`/server`: A [Socket.IO][socketio] app which is the game server.

## Features
 [x] Multiplayer
 [x] Player control
 [x] Camera
 [x] Basic scoreboard
 [x] Basic sprites
 [x] Stationary Enemies
 [x] Level loading from `.png`

## Todo
 [-] Title Screen
 [-] PvP Gamemode
 [-] Co-op Gamemode
 [-] Pathfinding Enemies
 [-] Gameplay loop or objective
 [-] Good sprites
 [-] Sounds
 [-] Music
 [-] Animations
 [-] Pre-made levels
 [-] Procedurally generated levels 

## Dependencies
See respective `package.json` files.

## License
[GPL-3.0][License]

[express]: https://expressjs.com/
[socketio]: https://socket.io/
[tanks]: https://nintendo.fandom.com/wiki/Tanks!
[license]: https://choosealicense.com/licenses/gpl-3.0/
