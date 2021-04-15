# CARDS AGAINST HUMANITY party game
> Let friends join your room and play Cards Against Humanity together!

## Table of contents
* [General info](#general-info)
* [Setup](#setup)
* [Usage](#usage)
* [Features](#features)
* [Legal](#legal)


## General info
This is a Node.js app, powered by Socket.io and Express.\
Style stuff is mostly done with W3CSS as I found it the easiest to implement a responsive design with.


## Setup
You need Node.js and a package manager, I use NPM.\
Clone this repo to your desktop and run `npm install` in it's root directory to install all the dependencies.\
Once you've installed the dependencies run `node server.js`.\
After that you'll be able to access the app in your browser at localhost:3000

## Usage
Normal rules of Cards Against Humanity apply.
If you're a Card Czar - wait until all the player submit their cards.\
If you're a Player - submit the right amount of cards to fill in the blanks in the black card in the middle.\
You can do that by tapping/clicking one of your cards (or multiple) and confirming them with a red button.\
Then the Card Czar can, after reading all submissions paired with the black card out loud, select the best submission and confirm the winner with the red button.\
Next the Card Czar needs to click "Next Round" in the top right corner, the points will be alloted to the winner and the next Card Czar will be chosen.\
There is no limit to the number of rounds (you can run out of the cards though, after many hours).\


## Features
* Checking if a username already exists in a room!
* No passwords, instead you need to know the room's name to join!
* Real time changes in the app thanks to socket.io!
* Responsive design for big screens and small!

## Legal
Card set is from https://www.crhallberg.com/cah/ .

Cards Against Humanity® is distributed under a Creative Commons BY-NC-SA 4.0 license.

Legal from Cards Against Humanity® website:

    We give you permission to use the Cards Against Humanity® writing under a limited Creative Commons BY-NC-SA 4.0 license. That means you can use our writing if (and only if) you do all of these things:

        1. Make your work available totally for free.

        2. Share your work with others under the same Creative Commons license that we use.

        3. Give us credit in your project.
