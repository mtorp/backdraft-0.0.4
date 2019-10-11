![BackDraft Logo](https://www.firehatlabs.com/img/bd.png)
=========

[![Build Status](https://travis-ci.org/FireHatLabs/backdraft.png)](https://travis-ci.org/FireHatLabs/backdraft)
[![GitHub version](https://badge.fury.io/gh/FireHatLabs%2Fbackdraft.svg)](http://badge.fury.io/gh/FireHatLabs%2Fbackdraft)
[![NPM version](https://badge.fury.io/js/backdraft.svg)](http://badge.fury.io/js/backdraft)
[![Dependencies](https://david-dm.org/FireHatLabs/backdraft.png)](https://david-dm.org/FireHatLabs/backdraft)
[![Coverage Status](https://coveralls.io/repos/FireHatLabs/backdraft/badge.png)](https://coveralls.io/r/FireHatLabs/backdraft)

Backdraft is API starting point built with the Express framework.

## Overall Goals:

- Create a package using Mongo, Express, Ember, Node stack (MEEN).
- Strive for safer and more secure starting point for API projects.
- Have a lightly styled web app, with very little clutter. (So it's easier to bring your own UI)
- Less coding, more moving by using configuration files and settings.

## Intended Use:

- Foundation for a new web application.
- Baseline support for user registration, authentication and account management.
- Ready to go billing with services like Stripe/PayPal.
- ```npm install backdraft``` - and you are ready to focus on your idea.
- Bring your own objects, models, etc.

## Current Activity:

- Getting inital functioning routes for user admin.
- Adding a basic public route with the standard API verbs. [backdraft-server-example](https://github.com/FireHatLabs/backdraft-server-example)
- Adding a basic non-public route with the standard API verbs. [backdraft-server-example](https://github.com/FireHatLabs/backdraft-server-example)
- Writing an Ember client to use the initial routes. [backdraft-client-example](https://github.com/FireHatLabs/backdraft-client-example)

## Next Activity:

- Focus on writing tests.
- Cleaning up code written so far.
- Adjust logging and security as needed.
- Add in billing support using Stripe.
- Breath.
- Release 0.1.0 version.
- Start building apps.



