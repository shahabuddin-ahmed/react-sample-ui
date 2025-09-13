// For regular SCSS imports: import "./Header.scss"
declare module "*.scss";

// If you use CSS Modules: import styles from "./Header.module.scss"
declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}
