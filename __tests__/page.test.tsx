import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(main)/page";
import { ItemProvider } from "@/contexts/ItemContext";
import { SearchProvider } from "@/contexts/SearchContext";

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <SearchProvider>
        <ItemProvider>
          <Page />
        </ItemProvider>
      </SearchProvider>,
    );

    const headings = screen.getAllByRole("heading", { level: 2 });

    headings.forEach((heading) => expect(heading).toBeInTheDocument());
  });
});
