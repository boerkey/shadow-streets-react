module.exports = {
    presets: ["module:@react-native/babel-preset"],
    plugins: [
        "babel-plugin-react-compiler",
        "babel-plugin-transform-remove-console",
        [
            "module-resolver",
            {
                root: ["./src"],
                alias: {
                    "@components": "./src/components",
                    "@screens": "./src/screens",
                    "@assets": "./src/assets",
                    "@utils": "./src/utils",
                    "@redux": "./src/redux",
                    "@interfaces": "./src/interfaces",
                    "@apis": "./src/apis",
                    "@hooks": "./src/hooks",
                    "@constants": "./src/constants",
                },
            },
        ],
        "react-native-reanimated/plugin", // Must be last
    ],
};
