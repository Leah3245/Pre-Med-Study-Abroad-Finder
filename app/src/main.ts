import "./styles.css";
import { locations } from "./data";
import { renderLocationsView } from "./locationsView";
import { renderProgramsView } from "./programsView";

const app = document.getElementById("app");
if (!app) throw new Error("Missing #app root element");
const root: HTMLElement = app;

const LOCATION_ROUTE = /^#\/location\/([a-z0-9-]+)$/;

/** Hash routing: "" shows the destination picker, "#/location/<slug>" shows its programs. */
function render(): void {
  const match = LOCATION_ROUTE.exec(window.location.hash);
  const location = match ? locations.find((l) => l.slug === match[1]) : undefined;

  if (location) {
    renderProgramsView(root, location, () => {
      window.location.hash = "";
    });
  } else {
    renderLocationsView(root, (slug) => {
      window.location.hash = `#/location/${slug}`;
    });
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
