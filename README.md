## Notes on getting started

### Node Server

1. Make sure to export the following values as environment variables

        export DARK_SKY_API_KEY=[key]
        export DATABASE_USER=[username]

2. Start server with the following

        node server.js



### Ember Server

1. Start the server with the following

        ember s --proxy http://127.0.0.1:3000 --output-path ../public/


### Deploys

1. Make sure you're in the `provision` directory

        ansible-playbook deploy.yml --ask-vault-pass
