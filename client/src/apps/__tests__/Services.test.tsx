import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServicesApp from "../Services";
import { act } from "react";

// Mock fetch for React Query
const mockServices = [
  {
    id: 1,
    title: "AI Product Design",
    description: "Futuristic, intuitive interfaces built from the ground up.",
    icon: "Sparkles",
    color: "from-[#00a8ff]/20 to-transparent",
    borderColor: "group-hover:border-[#00a8ff]/50",
  },
  {
    id: 2,
    title: "Custom SaaS & Apps",
    description:
      "Robust, scalable software architecture. We build web and mobile applications that don't just function, but dominate their market spaces.",
    icon: "Code2",
    color: "from-[#3c6382]/30 to-transparent",
    borderColor: "group-hover:border-[#3c6382]/50",
  },
  {
    id: 3,
    title: "Applied AI Integration",
    description:
      "Moving beyond the 'noise' of AI. We integrate real, useful artificial intelligence to solve actual business problems and increase your ROI.",
    icon: "Cpu",
    color: "from-teal-500/20 to-transparent",
    borderColor: "group-hover:border-teal-500/50",
  },
  {
    id: 4,
    title: "Platform Modernization",
    description:
      "Transform legacy systems into high-performance, modern tech stacks. Future-proof your business with cutting-edge runtime and cloud integrations.",
    icon: "Layers",
    color: "from-purple-500/20 to-transparent",
    borderColor: "group-hover:border-purple-500/50",
  },
];

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ServicesApp", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockServices,
    } as unknown as Response);
  });

  it("shows loading then renders cards", async () => {
    renderWithClient(<ServicesApp />);
    expect(await screen.findByText("AI Product Design", {}, { timeout: 8000 })).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false, status: 500, text: async () => "boom" } as Response);
    renderWithClient(<ServicesApp />);

    expect(await screen.findByText(/Failed to load services data/i, {}, { timeout: 8000 })).toBeInTheDocument();
  });

  it("shows four service cards with titles and descriptions", async () => {
    renderWithClient(<ServicesApp />);

    await waitFor(() => {
      mockServices.forEach((service) => {
        expect(screen.getByText(service.title)).toBeInTheDocument();
        expect(screen.getByText(service.description)).toBeInTheDocument();
      });
    });
  });

  it("opens the Project Initialization Console when a service is clicked", async () => {
    renderWithClient(<ServicesApp />);

    const user = userEvent.setup();
    const card = await screen.findByText("Custom SaaS & Apps");
    await user.click(card);

    await waitFor(() => {
      expect(
        screen.getByText(/Project Initialization Protocol/i)
      ).toBeInTheDocument();
    });
  });
});
