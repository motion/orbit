declare const config: {
    target: string;
    mode: string;
    entry: any;
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: RegExp;
                    chunks: string;
                    name: string;
                    priority: number;
                    enforce: boolean;
                };
            };
        };
    } | {
        noEmitOnErrors: boolean;
        removeAvailableModules: boolean;
        namedModules: boolean;
    } | {
        minimize: boolean;
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: RegExp;
                    chunks: string;
                    name: string;
                    priority: number;
                    enforce: boolean;
                };
            };
        };
    };
    output: {
        path: string;
        pathinfo: boolean;
        filename: string;
        publicPath: string;
        globalObject: string;
    };
    devServer: {
        historyApiFallback: boolean;
        hot: boolean;
        headers: {
            'Access-Control-Allow-Origin': string;
        };
    };
    devtool: string;
    resolve: {
        extensions: string[];
        mainFields: string[];
        alias: {
            '@babel/runtime': string;
            'core-js': string;
            react: string;
            'react-dom': string;
            'react-hot-loader': string;
            lodash: string;
        };
    };
    resolveLoader: {
        modules: string[];
    };
    module: {
        rules: ({
            test: RegExp;
            use: string;
        } | {
            include: string[];
            test: RegExp;
            use: (string | {
                loader: string;
                options: any;
            })[];
        } | {
            test: RegExp;
            use: {
                loader: string;
                options: {
                    name: string;
                };
            }[];
        } | {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    bypassOnDebug: boolean;
                };
            })[];
        })[];
    };
    plugins: any[];
};
export default config;
//# sourceMappingURL=webpack.config.d.ts.map