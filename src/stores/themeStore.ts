import { makeAutoObservable } from "mobx";

export interface ThemeStoreUpdate {
  showCartSidebar?: string;
}

class ThemeStore {
  showCartSidebar: string = "close";

  constructor() {
    makeAutoObservable(this);
  }

  get model() {
    return {
      showCartSidebar: this.showCartSidebar,
    };
  }

  updateStore(object: ThemeStoreUpdate) {
    this.showCartSidebar = object.showCartSidebar ?? this.showCartSidebar;
  }
}

export default ThemeStore;