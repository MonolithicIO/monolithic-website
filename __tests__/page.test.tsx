import Page from "../src/app/page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Page", () => {
  it("renders header", () => {
    render(<Page />);

    const header = screen.getByText("Hello, I'm seconde deploy");
    expect(header).toBeInTheDocument;
  });
});
