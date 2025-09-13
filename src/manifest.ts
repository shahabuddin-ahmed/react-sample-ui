interface ManifestConfig {
    title: string;
    description: string;
    keywords: string;
    author: string;
    apiHost: string;
}

const manifest: ManifestConfig = {
    title: "Cognitus Frontend Test",
    description:
        "An app to start react coding with campaign, authentication, and dashboard features",
    keywords: "Starter app for react",
    author: "Shahabuddin Ahmed",
    apiHost: "http://localhost:3000/api/v1",
};

export default manifest;
