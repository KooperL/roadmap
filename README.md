# Roadmap

This is a purpose made project to track my own ideas, bugs and enhancements. It's built to be an agnostic ticketing system to centralise ideas for projects that I definitely don't have the time for and improvements that could be made to any of my live sites. It would have been too easy to purpose build this only tracking development tickets but I wish to eventually fork this database schema into the foundation of a new project.


## Scope
The scope of this project is to be used in small scale teams for public information sharing. Given this, people cannot create user records, projects, or cards unless they have explicitly been given access. Anonymous comments are permitted.


## Self host
Built with tailwind, flowbite assets, svelte 4 and pocketbase. Hosted on pockethost. Install dependencies and start the project with `npm` commands.

Import the `pb.schema.json` schema into a new pocketbase project to get started. Create some `categories`, `statuses`, `workflows` and a `user` prior to use as this isn't possible with the web UI. Write access in the UI isn't possible without logging in.