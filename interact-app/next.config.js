require("dotenv").config();
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
        config.plugins.push(
            new webpack.ProvidePlugin({
                global: "global"
            })
        )

        config.resolve.fallback = {
            fs: false,
            stream: false,
            crypto: false,
            os: false,
            readline: false,
            ejs: false,
            assert: require.resolve("assert"),
            path: false
        }

        return config
    }

    return config
  },
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
    API_URL: process.env.API_URL,
    ETH_API: process.env.ETH_API,
    ETH_TOKEN_ADDRESS: process.env.ETH_TOKEN_ADDRESS,
    APTOS_NODE_URL: process.env.APTOS_NODE_URL,
    APTOS_FAUCET_URL: process.env.APTOS_FAUCET_URL
  },
}

module.exports = nextConfig
