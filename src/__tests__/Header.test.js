import {
  render,
  screen,
  cleanup,
  queryByAttribute,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "../components/Header/Header";

test("has logo", () => {
  const header = render(<Header />);
  const logo = header.container.querySelector("#logo");

  expect(logo).toBeInTheDocument();
});
test("has search-bar", () => {
  const header = render(<Header />);
  const search = header.container.querySelector("#search-bar");
  expect(search).toBeInTheDocument();
});
test("has messages-icon", () => {
  const header = render(<Header />);
  const messages = header.container.querySelector("#messages-icon");
  expect(messages).toBeInTheDocument();
});
