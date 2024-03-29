"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return {
        register: (server) => {
            return new Promise((resolve) => {
                server.register([
                    require('inert'),
                    require('vision'),
                    {
                        register: require('hapi-swagger'),
                        options: {
                            info: {
                                title: 'Task Api',
                                description: 'Task Api Documentation',
                                version: '1.0'
                            },
                            tags: [
                                {
                                    'name': 'tasks',
                                    'description': 'Api tasks interface.'
                                },
                                {
                                    'name': 'users',
                                    'description': 'Api users interface.'
                                },
                                {
                                    'name': 'maps',
                                    'description': 'Api users interface.'
                                }
                            ],
                            swaggerUI: true,
                            documentationPage: true,
                            documentationPath: '/docs'
                        }
                    }
                ], (error) => {
                    if (error) {
                        console.log(`Error registering swagger plugin: ${error}`);
                    }
                    resolve();
                });
            });
        },
        info: () => {
            return {
                name: "Swagger Documentation",
                version: "1.0.0"
            };
        }
    };
};
//# sourceMappingURL=index.js.map