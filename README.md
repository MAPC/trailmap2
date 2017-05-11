# Trailmap

Trailmap helps uses find bike, walking, hiking, and other trails in the Metro Boston region.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).


### Deploying

This app deploys with [Pagefront](https://pagefrontapp.com). To be able to deploy to trailmap.mapc.org, you need access to the app on 
Pagefront. Once you have access (through an MAPC admin or member of Digital Services), you need to create a file called `.env.deploy.production`. In there, you will need to specify your Pagefront key. The file will simply look something like this:

`PAGEFRONT_KEY=asdfb-12345-random-characters-12345`

From there, run `ember deploy production`. 
