interface Config {
  front: string;
  api: string;
  gallery: string;
  socket: string;
}

interface IConfigs {
  production: Config;
  local: Config;
}
type EnvKeys = keyof IConfigs;

const currentEnv = (import.meta.env.VITE_NODE_ENV || "local") as EnvKeys;

const configs: IConfigs = {
  local: {
    front: "http://localhost:5174",
    api: "http://127.0.0.1:3333", //"http://127.0.0.1:3333" | http://192.168.1.4:3333 //,
    socket: "http://127.0.0.1:3334",
    gallery: "http://127.0.0.1:9876",
  },
  production: {
    front: "https://bengkel.dedypry.site",
    api: "https://api-bengkel.dedypry.site",
    socket: "https://socket.dedypry.site",
    gallery: "https://gallery.dedypry.site",
  },
};

const config: Config = configs[currentEnv];

export default config;
