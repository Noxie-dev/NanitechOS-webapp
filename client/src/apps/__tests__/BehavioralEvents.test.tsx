import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServicesApp from "../Services";
import userEvent from "@testing-library/user-event";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("Behavioral events", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "AI Product Design",
          description: "Futuristic, intuitive interfaces built from the ground up.",
          icon: "Sparkles",
          color: "from-[#00a8ff]/20 to-transparent",
          borderColor: "group-hover:border-[#00a8ff]/50",
        },
      ],
    } as unknown as Response);

  });

  it("posts queued events to backend", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    renderWithClient(<ServicesApp />);

    // open modal to enqueue events
    const user = userEvent.setup();
    await user.click(await screen.findByText("AI Product Design"));

    await waitFor(() => {
      expect(screen.getByText(/Project Initialization Protocol/i)).toBeInTheDocument();
    });

    // advance timer to trigger flushEvents interval (5s)
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const postCall = fetchSpy.mock.calls.find((call) => call[0] === "/api/behavioral-events");
    expect(postCall).toBeTruthy();
    const body = JSON.parse((postCall as any)[1].body as string);
    expect(body.events.length).toBeGreaterThan(0);
  });
});
