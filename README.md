# Event Sorcerer

## Steps to Run the Project

### Start the Databases

1. In the terminal, type `cd data` to navigate to the data folder
2. Run the `pnpm i` command to install all packages.
3. Start the database in the background with `docker compose up -d`.
4. Run the `pnpm start` command to connect the server to localhost.
5. Wait for the message "Express server has started on port 4000.".
6. The database server should be up!

### Start the project

1. If you have just started the databases, navigate back to the main folder by typing `cd ..` in the terminal.
   Otherwise, skip this step.
2. Run the `pnpm i` command to install all packages.
3. Run the `pnpm build` command to build the server.
4. Run the `pnpm start` command to start the server.
5. The server should be running!
