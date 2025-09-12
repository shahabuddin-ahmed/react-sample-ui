import { type Metric, onCLS, onINP, onLCP, onTTFB } from "web-vitals";

// Define your own ReportHandler type
type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
    if (onPerfEntry && typeof onPerfEntry === "function") {
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
    }
};

export default reportWebVitals;
