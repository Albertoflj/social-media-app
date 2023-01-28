import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("renders button", () => {
  render(<App />);
  const button = screen.getByTestId("signInWithGoogle");
  expect(button).toBeInTheDocument();
});
