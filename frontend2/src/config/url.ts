interface UrlConfig {
  proxyUrl: string;
}

const devUrlConfig: UrlConfig = {
  proxyUrl: 'v1/api',
};

const proUrlConfig: UrlConfig = {
  proxyUrl: 'v1/api',
};

export function getUrlConfig(): UrlConfig {
  if (process.env.NODE_ENV === 'development') {
    return devUrlConfig;
  }
  return proUrlConfig;
}
