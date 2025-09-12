interface ManifestConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  apiHost: string;
}

const manifest: ManifestConfig = {
  title: "Cefalo Ecommerce Frontend",
  description:
    "An app to start react coding with deployment, transition, seo features",
  keywords: "Starter app for react",
  author: "Shahabuddin Ahmed",
  apiHost: "http://127.0.0.1:1500/api/v1",
};

export default manifest;