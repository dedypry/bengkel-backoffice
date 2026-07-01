interface Config {
  front: string;
  api: string;
  gallery: string;
  socket: string;
  pusher: {
    key: string;
    cluster: string;
  };
}

interface IConfigs {
  production: Config;
  local: Config;
}
type EnvKeys = keyof IConfigs;

const currentEnv = (import.meta.env.VITE_NODE_ENV || "local") as EnvKeys;

const pusherKey =
  import.meta.env.VITE_PUSHER_KEY || "a4cc33a43834e3273ccd";
const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || "ap1";

const configs: IConfigs = {
  local: {
    front: "http://localhost:5174",
    api: "http://127.0.0.1:3333",
    socket: "http://127.0.0.1:3334",
    gallery: "http://127.0.0.1:9876",
    pusher: {
      key: pusherKey,
      cluster: pusherCluster,
    },
  },
  production: {
    front: "https://pradanaautocare.id",
    api: "https://api.pradanaautocare.id",
    socket: "https://socket.pradanaautocare.id",
    gallery: "https://gallery.pradanaautocare.id",
    pusher: {
      key: pusherKey,
      cluster: pusherCluster,
    },
  },
};

const config: Config = configs[currentEnv];

export default config;
