# RIUFrontendBrendaDilschneider

Professional Angular 22 application developed by Brenda Soledad Dilschneider, structured and optimized for modern enterprise standards.

## Development Server

To start a local development server, run:

    ng serve

Once the server is running, open your browser and navigate to http://localhost:4200/. The application will automatically reload upon modifying any source files.

## Code Scaffolding

Angular CLI includes robust code scaffolding capabilities. To generate a new component, run:

    ng generate component component-name

For a comprehensive list of available schematics (components, directives, pipes), run:

    ng generate --help

## Production Build

To compile the project for production deployment, run:

    ng build --configuration=production

This compiles the project and outputs optimized build artifacts to the dist/ directory.

## Docker Deployment

To containerize and run the application locally using Docker:

    docker build -t riu-frontend .
    docker run -d -p 8080:80 --name riu-container riu-frontend

Access the application via http://localhost:8080.

## Running Unit Tests

To execute the unit testing suite with Karma and Jasmine, run:

    ng test

## Running End-to-End Tests

To run end-to-end (e2e) tests, use your preferred e2e testing command or framework configuration.

## Additional Resources

For further details on Angular CLI capabilities and commands, visit the official Angular Documentation.