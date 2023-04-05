import defaultConfig from "../public/settings.json";

let isLoaded = false;

const config = {
  customerFieldsPath: "", // "customerFields.json", - pre-definition is useless
  customerFields: {},
  customerEntityPath: "customerEntity.json",
  ...defaultConfig,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.onLoadConfig = (): void => {
  const { apiDomain } = config;

  if (!config.apiDomain) {
    // replace to default if value from settings is empty;
    config.apiDomain = apiDomain;
  }

  isLoaded = true;
};

export default config;
