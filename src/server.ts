import * as Hapi from "hapi";
import * as Boom from "boom";
import { IPlugin } from "./plugins/interfaces";
import { IServerConfigurations } from "./configurations";
import * as Tasks from "./tasks";
import * as Users from "./users";
import * as StreetMap from "./streetmap";

import { IDatabase } from "./database";


export function init(configs: IServerConfigurations, database: IDatabase): Promise<Hapi.Server> {

    return new Promise<Hapi.Server>(resolve => {

        const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || configs.port || 8080;
        console.log(port);
        const server = new Hapi.Server();
        server.connection({
            port: port,
            routes: {
                cors: true
            }
        });

        if (configs.routePrefix) {
            server.realm.modifiers.route.prefix = configs.routePrefix;
        }

        //  Setup Hapi Plugins
        const plugins: Array<string> = configs.plugins;
        const pluginOptions = {
            database: database,
            serverConfigs: configs
        };

        let pluginPromises = [];

        plugins.forEach((pluginName: string) => {
            var plugin: IPlugin = (require("./plugins/" + pluginName)).default();
            console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
            pluginPromises.push(plugin.register(server, pluginOptions));
        });

        Promise.all(pluginPromises).then(() => {
            console.log('All plugins registered successfully.');

            console.log('Register Routes');
            Tasks.init(server, configs, database);
            Users.init(server, configs, database);
            StreetMap.init(server, configs, database);
            console.log('Routes registered sucessfully.');

            resolve(server);
        });
    });
}
