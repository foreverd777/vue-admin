import store from "@/store/index";

export function buttonPerission(permission) {
  const button = store.getters["app/buttonPermission"];

  return button.indexOf(permission) != -1;
}
