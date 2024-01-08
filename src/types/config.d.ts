interface Config {
  source: {
    repository: string;
    checkout?: string;
    path: string;
  };
  target: {
    path: string;
  };
  fetchTempDirectory?: string;
}

export default Config;
