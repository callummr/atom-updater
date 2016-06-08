# Atom Updater

A small node script to update atom packages from git, written because the servers atom tries to update them from are blocked at work.

Currently run very manually by executing `node ./update` from the directory `update.js` is in.

This script attempts to asynchronously pull latest for each installed package from git. Currently it looks in the default atom package directory for these. Following a succesful pull it will run `npm install` to ensure dependencies are available. Success/fail count and any errors are output in the terminal.